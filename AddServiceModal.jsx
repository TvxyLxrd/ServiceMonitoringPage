import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import styled from '@emotion/styled';

const AddServiceModal = ({ onAdd, onClose }) => {
  const [newService, setNewService] = useState({ name: '', url: '' });

  const handleInputChange = (e) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const isValidUrlOrIp = (url) => {
    const urlRegex = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|(\d{1,3}\.){3}\d{1,3})(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
    return urlRegex.test(url);
  };

  const handleAdd = () => {
    if (newService.name && newService.url && isValidUrlOrIp(newService.url)) {
      const services = JSON.parse(localStorage.getItem('services')) || [];
      const newServiceWithId = { id: services.length + 1, ...newService };
      onAdd(newServiceWithId);
      localStorage.setItem('services', JSON.stringify([...services, newServiceWithId]));
      setNewService({ name: '', url: '' });
    }
  };

  return (
    <Modal>
      <ModalContent>
        <h2>Добавить сервис</h2>
        <InputGroup>
          <TextField
            label="Название"
            name="name"
            value={newService.name}
            onChange={handleInputChange}
          />
        </InputGroup>
        <InputGroup>
          <TextField
            label="URL"
            name="url"
            value={newService.url}
            onChange={handleInputChange}
          />
        </InputGroup>
        <ButtonGroup>
          <Button onClick={handleAdd}>Добавить</Button>
          <Button onClick={onClose}>Отмена</Button>
        </ButtonGroup>
      </ModalContent>
    </Modal>
  );
};

const Modal = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export default AddServiceModal;
