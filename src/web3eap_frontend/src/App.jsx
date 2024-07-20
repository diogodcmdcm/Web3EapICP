import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EapView from './components/eapView';
import ProjectView from './components/projectView';

function App() {

  return (           
    <Router>
      <Routes>
        <Route path="/" element={<ProjectView/>} /> 
        <Route path="/eapLink/:idProjeto" element={<EapView/>} /> 
      </Routes>                  
    </Router>

  );
};

export default App;
