import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import React from 'react';
import { Button, Form, Modal, Navbar, Nav, Card, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { web3eap_backend } from 'declarations/web3eap_backend';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

function calendarioProjetoView() { 

  const { idProjeto } = useParams(); 

  //constantes utilizadas para configuração do componente do calendario
  const [events, setEvents] = React.useState([]);    
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');    
  const [start, setStart] = React.useState();
  const [end, setEnd] = React.useState();  
  const [view, setView] = React.useState('month'); // Definindo a visão padrão como 'mês'
 
  // Constante utilizada para apresentar os detalhes de uma data
  const editEvent = (event) => {
    setOpen(true);        
    const newEditEvent = events.find((elem) => elem.title === event.title);        
    setTitle(newEditEvent.title);    
    setStart(moment(newEditEvent.start).format('DD/MM/YYYY'));
    setEnd(moment(newEditEvent.end).format('DD/MM/YYYY'));    
  };  

  const handleClose = () => {    
    setOpen(false);    
  };
    
  useEffect( () => {     

    const carregarCalendario = async () => {
      
      // busca os itens da EAP para obter as informações que serão necessárias renderizar no calendario
      let response = await web3eap_backend.getArrayItensEAP(idProjeto);
    
      let calendarioEvents = [];
      for (let i=0; i < response[0].length; i++) {

        if(i>0){
        
          // Extrai o ano (4 primeiros caracteres)
          const anoInicio = response[0][i].dataInicio.substring(0, 4);  
          // Extrai o mês (do 6º ao 7º caractere)
          const mesInicio = response[0][i].dataInicio.substring(5, 7);          
          // Extrai o dia (do 9º ao 10º caractere)
          const diaInicio = response[0][i].dataInicio.substring(8, 10);        

          // Extrai o ano (4 primeiros caracteres)
          const anoConclusao = response[0][i].dataConclusao.substring(0, 4);  
          // Extrai o mês (do 6º ao 7º caractere)
          const mesConclusao = response[0][i].dataConclusao.substring(5, 7);          
          // Extrai o dia (do 9º ao 10º caractere)
          const diaConclusao = response[0][i].dataConclusao.substring(8, 10);        
    
          calendarioEvents.push( {title: response[0][i].atividade, start: new Date(anoInicio, (mesInicio-1), diaInicio, 5, 0)  , end: new Date(anoConclusao, (mesConclusao-1), diaConclusao, 6, 0),  allDay: true } );
        }      
      }

      setEvents(calendarioEvents);

    };  
    
    carregarCalendario();       

  }, []);  
                  
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
            <Button variant="light">Sair</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
         
      <Card>
        <Card.Body>{idProjeto} / Calendário do Projeto</Card.Body>
      </Card>                  

      <br/>
      <section id="calendario">
        
      <Calendar            
            resizable
            popup 
            key={events.length}
            events={events}
            view={view}
            onView={(newView) => setView(newView)}
            views={['month']} 
            defaultView='month'
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={moment().toDate()}
            localizer={localizer}
            style={{ height: 'calc(100vh - 180px' }}
            onSelectEvent={(event) => editEvent(event)}            
            showMultiDayTimes            
          />
      
      <Modal show={open} onHide={handleClose} >
        
          <Modal.Body>            
            <h1>Agenda</h1>

            <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Atividade:</Form.Label>
                <Form.Control type="text" readOnly placeholder=""  value={title} />
            </Form.Group>     
            <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Data Início:</Form.Label>
                <Form.Control type="text" readOnly placeholder=""  value={start} />
            </Form.Group>                 
            <Form.Group className="mb-3" controlId="nome">
                <Form.Label>Data de Conclusão:</Form.Label>
                <Form.Control type="text" readOnly placeholder=""  value={end} />
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

export default calendarioProjetoView;
