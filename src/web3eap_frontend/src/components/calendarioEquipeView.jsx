import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React from 'react';
import { Button, Form, Modal, Navbar, Nav, Card, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createActor, web3eap_backend } from 'declarations/web3eap_backend';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import {AuthClient} from "@dfinity/auth-client"
import {HttpAgent} from "@dfinity/agent";

let actorWeb3EAPBackend = web3eap_backend;

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

function calendarioEquipeView() { 

  const { idProjeto } = useParams(); 
  
  //constantes utilizadas para configuração do componente do calendario
  const [events, setEvents] = React.useState([]);  
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');  
  const [start, setStart] = React.useState();
  const [end, setEnd] = React.useState();  
  const [view, setView] = React.useState('month'); // Definindo a visão padrão como 'mês'  
  const [horaInicio, setHoraInicio] = React.useState();
  const [horaConclusao, setHoraConclusao] = React.useState();
  
  // Constante utilizada para apresentar os detalhes de uma data
  const editEvent = (event) => {
    setOpen(true);
        
    const newEditEvent = events.find((elem) => elem.title === event.title);    
    
    setTitle(newEditEvent.title);    
    setStart(moment(newEditEvent.start).format('DD/MM/YYYY'));        
    setHoraInicio(moment(newEditEvent.start).format('HH:mm'));
    setHoraConclusao(moment(newEditEvent.end).format('HH:mm'));    
    
  };  

  const handleClose = () => {    
    setOpen(false);    
  };  
  
  useEffect( async () => {     

    // função utilizada para verificar se o usuário está autenticado na rede da ICP 
    async function initAuth() {
      const authClient = await AuthClient.create();

      // Verifica se já há uma sessão autenticada
      const authenticated = await authClient.isAuthenticated();
      if (authenticated) {
        const identity = authClient.getIdentity();        

        /* A identidade do usuário autenticado poderá ser utilizada para criar um HttpAgent.
        Ele será posteriormente utilizado para criar o Actor (autenticado) correspondente ao Canister de Backend  */
        const agent = new HttpAgent({identity});
        /* O comando abaixo irá criar um Actor Actor (autenticado) correspondente ao Canister de Backend  
          desta forma, todas as chamadas realizadas a metodos SHARED no Backend irão receber o "Principal" do usuário */
        actorWeb3EAPBackend = createActor(process.env.CANISTER_ID_WEB3EAP_BACKEND, {
            agent,
        });
        
        const carregarCalendario = async () => {
      
          // busca as agendas para obter as informações que serão necessárias renderizar no calendario
          let idP = parseInt(idProjeto);
          let response = await actorWeb3EAPBackend.getArrayAgendaEquipe(idP);    
          let calendarioEvents = [];
    
          for (let i=0; i < response[0].length; i++) {
            if(i>0){      
              // Extrai o ano (4 primeiros caracteres)
              const ano = response[0][i].data.substring(0, 4);  
              // Extrai o mês (do 6º ao 7º caractere)
              const mes = response[0][i].data.substring(5, 7);          
              // Extrai o dia (do 9º ao 10º caractere)
              const dia = response[0][i].data.substring(8, 10);        
                      
              const [horaInicio, minutoInicio] = response[0][i].horaInicio.split(":");
              const [horaConclusao, minutoConclusao] = response[0][i].horaConclusao.split(":");
        
              calendarioEvents.push( {title: response[0][i].nome + ' - ' + response[0][i].atividade, start: new Date(ano, (mes-1), dia, horaInicio, minutoInicio)  , end: new Date(ano, (mes-1), dia, horaConclusao, minutoConclusao) } );
            }      
          }
          setEvents(calendarioEvents);
        };  
        
        carregarCalendario();       

      } else {        
        // caso o usuário não estiver autenticado na rede da ICP
        window.location.href = '/';
      }
    }

    await initAuth();    

  }, []);  
                
  // funcão para desconectar da rede da ICP
  async function handleLogout(){
    const authClient = await AuthClient.create();  
    // Força o logout e direciona para a página de login
    await authClient.logout();     
    window.location.href = '/';
  };

  return (
    <div>    

      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Collapse id="navbarScroll">              
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll >
              <Nav.Link  href="/">Lista de Projetos</Nav.Link>                                
              <Nav.Link>|</Nav.Link>      
              <Nav.Link  href={'/eapLink/'+idProjeto} >EAP do Projeto</Nav.Link>                                        
              <Nav.Link>|</Nav.Link>                           
              <Nav.Link  href={'/equipeLink/'+idProjeto} >Equipe do Projeto</Nav.Link>                                        
              <Nav.Link>|</Nav.Link>
              <Nav.Link  href={'/agendaLink/'+idProjeto} >Agenda da Equipe</Nav.Link>                
              <Nav.Link>|</Nav.Link>
              <Nav.Link  href={'/calendarioEquipeLink/'+idProjeto} >Calendário da Equipe</Nav.Link>                
              <Nav.Link>|</Nav.Link>
              <Nav.Link  href={'/calendarioProjetoLink/'+idProjeto} >Calendário do Projeto</Nav.Link>              
            </Nav>              
            <Button onClick={handleLogout} variant="light">Sair</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
         
      <Card>
        <Card.Body>{idProjeto} / Calendário da Equipe</Card.Body>
      </Card>             

      <br/>
      <section id="calendario">

          <Calendar            
            resizable
            popup 
            key={events.length}
            events={events}
            views={['month', 'week', 'day', 'agenda', 'work_week']} 
            onView={(newView) => setView(newView)}            
            defaultView='month'
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={moment().toDate()}
            localizer={localizer}
            style={{ height: 'calc(100vh - 180px' }}
            onSelectEvent={(event) => editEvent(event)}            
            showMultiDayTimes            
            step={60}
          />

      <Modal show={open} onHide={handleClose} backdrop="static" keyboard={false} >
        
          <Modal.Body>            
            <h1>Agenda</h1>

            <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Pessoa/Atividade:</Form.Label>
                <Form.Control type="text" readOnly placeholder=""  value={title} />
            </Form.Group>     
            <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Data:</Form.Label>
                <Form.Control type="text" readOnly placeholder=""  value={start} />
            </Form.Group>                 
            <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Horário de Início:</Form.Label>
                <Form.Control type="text" readOnly placeholder=""  value={horaInicio} />
            </Form.Group>               
            <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Horário de Conclusão:</Form.Label>
                <Form.Control type="text" readOnly placeholder=""  value={horaConclusao} />
            </Form.Group>               
          </Modal.Body>          
          
          <Modal.Footer >
            <Button onClick={handleClose}>Fechar</Button>            
          </Modal.Footer>          
        
      </Modal>
      
      </section>
    </div>
  );
}

export default calendarioEquipeView;
