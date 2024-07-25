import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import AddServiceModal from './AddServiceModal';
import EditServiceModal from './EditServiceModal';
import deleteButtonIcon from '../../assets/images/delete-button.png';
import editButtonIcon from '../../assets/images/edit-button.png';
import styled from 'styled-components';

const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const [servicesStatus, setServicesStatus] = useState({});
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const storedServices = JSON.parse(localStorage.getItem('services')) || [];
    setServices(storedServices);
    const initialServicesStatus = storedServices.reduce((acc, service) => {
      acc[service.id] = 'loading';
      return acc;
    }, {});
    setServicesStatus(initialServicesStatus);
    pingServices(); // Вызываем pingServices() при монтировании компонента
  }, []);

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  const pingService = async (url) => {
    try {
      const isIpAddress = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(url);
      const requestUrl = isIpAddress ? `https://${url}` : url.startsWith('https://') ? url : `https://${url}`;
      const response = await axios.get(requestUrl);
      return response.status === 200 ? 'online' : 'degraded';
    } catch (error) {
      return 'offline';
    }
  };

  const handleAddService = async (newService) => {
    const status = await pingService(newService.url);
    // Создаем новый id, используя URL в качестве основы
    const newId = hashCode(newService.url);
    const newServiceWithStatus = { id: newId, ...newService, status };
    setServices([...services, newServiceWithStatus]);
    setServicesStatus({ ...servicesStatus, [newServiceWithStatus.id]: status });
    pingServices(); // Вызываем pingServices() после добавления нового сервиса
  };

  const handleEditService = (service) => {
    setEditingServiceId(service.id);
    setShowEditModal(true);
  };

  const handleSaveEditedService = (updatedService) => {
    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
    setServicesStatus({ ...servicesStatus, [updatedService.id]: servicesStatus[updatedService.id] });
    setEditingServiceId(null);
    setShowEditModal(false);
  };

  const handleDeleteService = (serviceId) => {
    const updatedServices = services.filter((service) => service.id !== serviceId);
    setServices(updatedServices);
    setServicesStatus(
      Object.keys(servicesStatus).reduce((acc, key) => {
        if (parseInt(key) !== serviceId) {
          acc[key] = servicesStatus[key];
        }
        return acc;
      }, {})
    );
    localStorage.setItem('services', JSON.stringify(updatedServices));
  };

  // Функция для создания уникального id из URL
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  const intervalIdRef = useRef(null);

  const pingServices = useCallback(async () => {
    clearInterval(intervalIdRef.current);
    for (let i = 0; i < services.length; i++) {
      const service = services[i];
      try {
        const response = await axios.get(service.url.startsWith('https://') ? service.url : `https://${service.url}`);
        setServicesStatus((prevStatus) => ({
          ...prevStatus,
          [service.id]: response.status === 200 ? 'online' : 'degraded',
        }));
      } catch (error) {
        console.error(`Ping to ${service.url} failed with error ${error}`);
        setServicesStatus((prevStatus) => ({
          ...prevStatus,
          [service.id]: 'offline',
        }));
      }
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Ждем 3 секунды перед следующим пингом
    }
    intervalIdRef.current = setInterval(() => {
      pingServices();
    }, 30000); // Пинг каждые 30 секунд
  }, [services, setServicesStatus]);

  useEffect(() => {
    pingServices(); // Вызываем pingServices() при обновлении services
    return () => clearInterval(intervalIdRef.current);
  }, [pingServices]);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Название</th>
            <th>URL</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <ServiceCardWrapper key={service.id}>
              <td>{service.name}</td>
              <td>{service.url}</td>
              <td>
                <ServiceStatus color={getStatusColor(servicesStatus[service.id])}>
                  {getStatusIcon(servicesStatus[service.id])}
                </ServiceStatus>
              </td>
              <ButtonsContainer>
                <Button onClick={() => handleDeleteService(service.id)}>
                  <img src={deleteButtonIcon} alt="Delete" />
                </Button>
                <Button onClick={() => handleEditService(service)}>
                  <img src={editButtonIcon} alt="Edit" />
                </Button>
              </ButtonsContainer>
            </ServiceCardWrapper>
          ))}
        </tbody>
      </Table>
      <AddButton onClick={() => setShowAddModal(true)}>Добавить сервис</AddButton>
      {showAddModal && (
        <AddServiceModal onAdd={handleAddService} onClose={() => setShowAddModal(false)} />
      )}
      {showEditModal && (
        <EditServiceModal
          service={services.find((s) => s.id === editingServiceId)}
          onSave={handleSaveEditedService}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  if (status === 'online') return 'green';
  if (status === 'degraded') return '#ffa500';
  return 'red';
};

const getStatusIcon = (status) => {
  if (status === 'online') return '✓';
  if (status === 'degraded') return '●';
  return '❌';
};

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const ServiceCardWrapper = styled.tr`
  border-bottom: 1px solid #ccc;
`;

const ServiceStatus = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.color};
  font-weight: bold;
  justify-content: space-evenly;
`;

const ButtonsContainer = styled.td`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  img {
    width: 20px;
    height: 20px;
  }
`;

const AddButton = styled.button`
  display: block;
  margin-top: 12px;
  color: black;
`;

export default ServiceTable;
