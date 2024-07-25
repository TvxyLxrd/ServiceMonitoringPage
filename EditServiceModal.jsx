import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import styled from '@emotion/styled';

const EditServiceModal = ({ service, onSave, onClose }) => {
  const [editedService, setEditedService] = useState(service);

  const handleInputChange = (e) => {
    setEditedService({ ...editedService, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const services = JSON.parse(localStorage.getItem('services')) || [];
    const updatedServices = services.map((s) =>
      s.id === editedService.id ? editedService : s
    );
    localStorage.setItem('services', JSON.stringify(updatedServices));
    onSave(editedService);
    onClose();
  };

  return (
    <Modal>
      <ModalContent>
        <h2>Редактировать сервис</h2>
        <InputGroup>
          <TextField
            label="Название"
            name="name"
            value={editedService.name}
            onChange={handleInputChange}
          />
        </InputGroup>
        <InputGroup>
          <TextField
            label="URL"
            name="url"
            value={editedService.url}
            onChange={handleInputChange}
          />
        </InputGroup>
        <ButtonGroup>
          <Button onClick={handleSave}
          sx={{
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '4px',
            color: 'blue',
            fontFamily: "'Arial', sans-serif",
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            fontFamily: "'Bellota Text', sans-serif",
          }}          
          >Сохранить</Button>
          <Button onClick={onClose}
          sx={{
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '4px',
            color: 'blue',
            fontFamily: "'Arial', sans-serif",
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            fontFamily: "'Bellota Text', sans-serif",
          }}
          >Отмена</Button>
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

export default EditServiceModal;
