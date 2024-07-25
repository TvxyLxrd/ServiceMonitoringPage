import React from 'react';
import ServiceTable from './ServiceTable';
import { NavLink } from 'react-router-dom';

<NavLink to="/service-monitoring" activeClassName="active">Мониторинг сервисов</NavLink>



const ServiceMonitoringPage = () => {
  return (
    <div>
      <h1>Мониторинг сервисов</h1>
      <ServiceTable />
    </div>
  );
};

export default ServiceMonitoringPage;
