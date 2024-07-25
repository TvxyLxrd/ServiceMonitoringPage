import React from 'react';
import styled from 'styled-components';

const ServiceCard = ({ service }) => {
  const getStatusColor = () => {
    if (service.status === 'online') return 'green';
    if (service.status === 'degraded') return '#ffa500';
    return 'red';
  };

  const getStatusIcon = () => {
    if (service.status === 'online') return '✓';
    if (service.status === 'degraded') return '●';
    return '❌';
  };

  return (
    <ServiceCardWrapper>
      <ServiceInfoWrapper>
        <ServiceName>{service.name}</ServiceName>
        <ServiceStatus color={getStatusColor()}>
          <StatusDot color={getStatusColor()} />
          {getStatusIcon()}
        </ServiceStatus>
      </ServiceInfoWrapper>
    </ServiceCardWrapper>
  );
};

const ServiceCardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  flex-grow: 1;
`;

const ServiceInfoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ServiceName = styled.div`
  font-weight: bold;
`;

const ServiceStatus = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => props.color};
  font-weight: bold;
  margin-left: 8px;
`;

const StatusDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin-right: 8px;
`;

export default ServiceCard;
