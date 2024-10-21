import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginView from './components/login';
import EapView from './components/eapView';
import ProjectView from './components/projectView';
import EquipeView from './components/equipeView';
import AgendaView from './components/agendaView';
import CalendarioProjetoView from './components/calendarioProjetoView';
import CalendarioEquipeView from './components/calendarioEquipeView';

function App() {

  return (           
    <Router>
      <Routes>
      
        <Route path="/" element={<LoginView/>} />    
        <Route path="/projectLink/" element={<ProjectView/>} />    
        <Route path="/eapLink/:idProjeto" element={<EapView/>} /> 
        <Route path="/equipeLink/:idProjeto" element={<EquipeView/>} />    
        <Route path="/agendaLink/:idProjeto" element={<AgendaView/>} />    
        <Route path="/calendarioEquipeLink/:idProjeto" element={<CalendarioEquipeView/>} />                      
        <Route path="/calendarioProjetoLink/:idProjeto" element={<CalendarioProjetoView/>} />                      
      </Routes>                  
    </Router>

  );
};

export default App;
