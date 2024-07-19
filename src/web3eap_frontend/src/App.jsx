import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { web3eap_backend } from 'declarations/web3eap_backend';
import { Container, Table, Button, Nav, Row, Col, FloatingLabel, Form, Stack, Modal } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Link, Route } from 'react-router-dom';
import EapView from './components/eapView';
import ProjectView from './components/projectView';
import TopToolBar from './components/topToolBar';

function App() {

         

  return (           
    <Router>
      <Routes>
        <Route path="/" element={<ProjectView/>} /> 
        <Route path="/eapLink/:idProjeto" element={<EapView/>} /> 
      </Routes>                  
    </Router>

  );
}

export default App;
