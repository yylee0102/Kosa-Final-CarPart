import React from 'react';
import Admin from '../components/Admin.jsx';
import { Container, MainContent } from '../css/AdminStyle.jsx';

const AdminPage = () => {
  return (
    <Container>
      <MainContent>
        <Admin />
      </MainContent>
    </Container>
  );
};

export default AdminPage;
