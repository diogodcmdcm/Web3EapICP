import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { web3eap_backend } from 'declarations/web3eap_backend';
import { Table, Button, Form, Stack, Modal, Navbar, Nav, Card, Container, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moment from 'moment';

function agendaView() { 
  
  const { idProjeto } = useParams(); 
  
  useEffect( async () => {     
    
    setExibeCarregando(true);
    let responseEquipe = await web3eap_backend.getArrayEquipe(idProjeto);    
    setEquipeOpcoes(responseEquipe[0]);    

    let responseAtividade = await web3eap_backend.getArrayItensEAP(idProjeto);    
    setAtividadeOpcoes(responseAtividade[0]);
    
    let response = await web3eap_backend.getArrayAgendaEquipe(idProjeto);
    //let eapOrdenada = response[0].sort((a,b) => (a.codigo.replace(/\./g, '')) - (b.codigo.replace(/\./g, '')) ); // funcao para ordenar o array 
    setAgendaEquipe(response[0]);  
    
    setExibeCarregando(false);

  }, []);  

  const [showPopupAdicionar, setShowPopupAdicionar] = useState(false);  
  const [showPopupEditar, setShowPopupEditar] = useState(false);  
  const [agendaEquipe, setAgendaEquipe] = useState([]);
  const [equipeOpcoes, setEquipeOpcoes] = useState([]);
  const [atividadeOpcoes, setAtividadeOpcoes] = useState([]);
              
  const [nome, setNome] = useState('');
  const [atividade, setAtividade] = useState('');
  const [data, setData] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaConclusao, setHoraConclusao] = useState('');

  const [idItemPopup, setIdItemPopup] = useState('');
  const [nomePopup, setNomePopup] = useState('');
  const [atividadePopup, setAtividadePopup] = useState('');
  const [dataPopup, setDataPopup] = useState('');
  const [horaInicioPopup, setHoraInicioPopup] = useState('');
  const [horaConclusaoPopup, setHoraConclusaoPopup] = useState('');  

  const [exibeCarregando, setExibeCarregando] = useState(false);
  const [exibirMensagemExclusao, setExibirMensagemExclusao] = useState(false); 
  const [idExcluir, setIdExcluir] = useState(null); 

  async function adicionarItem() {        
    
    if(nome == null || nome.trim()==''){
      alert("Informe o nome");
    } else if(atividade == null || atividade.trim()==''){
      alert("Informe a atividade");
    } else if(data == null || data.trim()==''){
      alert("Informe a data");
    } else if(horaInicio == null || horaInicio.trim()==''){
      alert("Informe a hora de início");
    } else if(horaConclusao == null || horaConclusao.trim()==''){
      alert("Informe a hora de conclusão");  
    } else {

      setExibeCarregando(true);
      setShowPopupAdicionar(false);
      await web3eap_backend.addAgendaEquipe(idProjeto, nome, atividade, data, horaInicio, horaConclusao);                                            
      let response = await web3eap_backend.getArrayAgendaEquipe(idProjeto);
    
      setAgendaEquipe(response[0]);      

      setNome(''); 
      setAtividade(''); 
      setData(''); 
      setHoraInicio(''); 
      setHoraConclusao(''); 
      setExibeCarregando(false);

    }    
        
  } 

  async function excluirItem() { 

      setExibeCarregando(true);
      await web3eap_backend.excluirAgendaEquipe(idProjeto, idExcluir);
      let response = await web3eap_backend.getArrayAgendaEquipe(idProjeto);

      //let eapFormatada = formatarEAP(response[0]);       
      setAgendaEquipe(response[0]);
      setExibeCarregando(false);
  }

  function exibirMensagemExcluir(id){
    setExibirMensagemExclusao(true);
    setIdExcluir(id);
  }

  function confirmarExclusao(){
    setExibirMensagemExclusao(false);    
    excluirItem();
  }
                                   
  async function abrirPopupEditar(idItem, nome, atividade, data, horaInicio, horaConclusao) {   
      setShowPopupEditar(true);    
      setIdItemPopup(idItem);
      setNomePopup(nome);
      setAtividadePopup(atividade);
      setDataPopup(data);
      setHoraInicioPopup(horaInicio);
      setHoraConclusaoPopup(horaConclusao);
  }

  async function salvarAlteracao() {        

    if(nomePopup == null || nomePopup.trim()==''){
      alert("Informe o nome");
    } else if(atividadePopup == null || atividadePopup.trim()==''){
      alert("Informe a atividade");
    } else if(dataPopup == null || dataPopup.trim()==''){
      alert("Informe a data");
    } else if(horaInicioPopup == null || horaInicioPopup.trim()==''){
      alert("Informe a hora de início");
    } else if(horaConclusaoPopup == null || horaConclusaoPopup.trim()==''){
      alert("Informe a hora de conclusão");
    } else {     

      setShowPopupEditar(false);    
      setExibeCarregando(true);
      await web3eap_backend.alterarAgendaEquipe(idProjeto, idItemPopup,nomePopup, atividadePopup, dataPopup, horaInicioPopup, horaConclusaoPopup);
      let response = await web3eap_backend.getArrayAgendaEquipe(idProjeto);

      //let eapFormatada = formatarEAP(response[0]);       
      setAgendaEquipe(response[0]);     

      setIdItemPopup('');
      setNomePopup(''); 
      setAtividadePopup(''); 
      setDataPopup(''); 
      setHoraInicioPopup(''); 
      setHoraConclusaoPopup(''); 
      setExibeCarregando(false);
    }

  }        
    
  const handleNome = (event) => {
    setNome(event.target.value);
  };
  
  const handleAtividade = (event) => {
    setAtividade(event.target.value);
  };

  const handleData = (event) => {
    setData(event.target.value);
  };

  const handleHoraInicio = (event) => {
    setHoraInicio(event.target.value);
  };

  const handleHoraConclusao = (event) => {
    setHoraConclusao(event.target.value);
  };

  const handleNomePopup = (event) => {
    setNomePopup(event.target.value);
  };
  
  const handleAtividadePopup = (event) => {
    setAtividadePopup(event.target.value);
  };

  const handleDataPopup = (event) => {
    setDataPopup(event.target.value);
  };

  const handleHoraInicioPopup = (event) => {
    setHoraInicioPopup(event.target.value);
  };

  const handleHoraConclusaoPopup = (event) => {
    setHoraConclusaoPopup(event.target.value);
  };

  const handleClosePopupEditar = () => setShowPopupEditar(false);  

  const handleClosePopupAdicionar = () => setShowPopupAdicionar(false);  

  async function abrirPopupAdicionar() {       
    setShowPopupAdicionar(true);       
  }

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
        <Card.Body>{idProjeto} / Agenda da Equipe</Card.Body>
      </Card>      

      <br/>
      <section id="agendas">
        <Table striped bordered hover>
          <thead>
            <th>Ação</th>
            <th>Pessoa</th>
            <th>Atividade</th>
            <th>Data</th>
            <th>Horário Início</th>
            <th>Horário Conclusão</th>            
          </thead>

          <tbody>
          {   
              agendaEquipe.map((linha) => 
                  <tr>
                      <td>
                          <Stack direction="horizontal" gap={0}>   

                          { (linha.atividade == '') && <div className="p-1">
                                  <Button onClick={ () => { abrirPopupAdicionar() } }  variant="outline-secondary" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus">
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                      <path d="M9 12h6" />
                                      <path d="M12 9v6" />
                                    </svg>
                                  </Button>
                              </div>
                          }      

                          { (linha.atividade != '') && <div className="p-1">
                                  <Button onClick={ () => { exibirMensagemExcluir(linha.id) } }  variant="outline-secondary" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                      <path d="M4 7l16 0" />
                                      <path d="M10 11l0 6" />
                                      <path d="M14 11l0 6" />
                                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                    </svg>
                                  </Button>
                              </div>
                          }
                          { (linha.atividade != '') &&  <div className="p-1">
                                <Button onClick={ () => { abrirPopupEditar(linha.id, linha.nome, linha.atividade, linha.data, linha.horaInicio, linha.horaConclusao ) } }  variant="outline-secondary" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil" >
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                      <path d="M13.5 6.5l4 4" />
                                    </svg>
                                </Button>
                              </div>
                          }
                           
                          </Stack>
                      </td>
                      <td>{linha.nome}</td>
                      <td><pre>{linha.atividade}</pre></td>      
                      <td>{linha.data ? moment(linha.data).format('DD/MM/YYYY') : '' }</td>                            
                      <td>{linha.horaInicio}</td>      
                      <td>{linha.horaConclusao}</td>                                            
                  </tr>
              )
          }    
        </tbody>

        </Table>
    
        <Modal show={showPopupAdicionar} onHide={handleClosePopupAdicionar}>
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Agenda</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
                <Form.Group className="mb-3" controlId="codigo">
                    <Form.Label>Informe a pessoa*</Form.Label>
                    <Form.Select aria-label="Selecione" value={nome} onChange={handleNome} >
                      <option>Selecione</option>                  
                      {   
                        equipeOpcoes.map((op) =>
                          <option value={op.nome}>{op.nome}</option> 
                      )}
                    </Form.Select>                      
                </Form.Group>                    
            
                <Form.Group className="mb-3" controlId="atividade">
                    <Form.Label>Informe a Atividade*</Form.Label>
                    <Form.Select aria-label="Selecione" value={atividade} onChange={handleAtividade} >
                      <option>Selecione</option>                                        
                      {   
                        atividadeOpcoes.map((op) =>
                          <option value={op.atividade}>{op.atividade}</option> 
                      )}
                  </Form.Select>                      
                </Form.Group>                

                <Form.Group className="mb-3" controlId="dataInicio">
                    <Form.Label>Informe a Data*</Form.Label>
                    <Form.Control type="date"  placeholder=""  value={data} onChange={handleData} />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="horas">
                    <Form.Label>Hora de Início*</Form.Label>
                    <Form.Control type="text"  placeholder=""  value={horaInicio} onChange={handleHoraInicio} />
                </Form.Group>
            
                <Form.Group className="mb-3" controlId="horas">
                    <Form.Label>Hora de Conclusão*</Form.Label>
                    <Form.Control type="text"  placeholder=""  value={horaConclusao} onChange={handleHoraConclusao} />
                </Form.Group>                
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePopupAdicionar}>Cancelar</Button>
            <Button variant="primary" onClick={adicionarItem} >Salvar</Button>
          </Modal.Footer>
      </Modal>        

        <Modal show={showPopupEditar} onHide={handleClosePopupEditar}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Agenda</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>

              <Form.Group className="mb-3" controlId="popup.nome">
                <Form.Label>Pessoa*</Form.Label>                
                    <Form.Select aria-label="Selecione" value={nomePopup} onChange={handleNomePopup} >
                      <option>Selecione</option>        
                      {   
                        equipeOpcoes.map((op) =>
                          <option value={op.nome}>{op.nome}</option> 
                      )}                                
                    </Form.Select>                
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.atividade">
                <Form.Label>Atividade*</Form.Label>
                <Form.Select aria-label="Selecione" value={atividadePopup} onChange={handleAtividadePopup} >                      
                      <option>Selecione</option>       
                      {   
                        atividadeOpcoes.map((op) =>
                          <option value={op.atividade}>{op.atividade}</option> 
                      )}                                 
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.data">
                <Form.Label>Data*</Form.Label>
                <Form.Control value={dataPopup} type="date" onChange={handleDataPopup} placeholder=""  defaultValue=""  />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.horaInicio">
                <Form.Label>Hora de Início</Form.Label>
                <Form.Control value={horaInicioPopup} type="text" onChange={handleHoraInicioPopup}  placeholder=""  defaultValue=""  />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.horaConclusao">
                <Form.Label>Hora de Conclusão</Form.Label>
                <Form.Control value={horaConclusaoPopup} type="text" onChange={handleHoraConclusaoPopup}  placeholder=""  defaultValue=""  />
              </Form.Group>              

            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePopupEditar}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={salvarAlteracao}>
              Salvar Alterações
            </Button>
          </Modal.Footer>
      </Modal>        
      
      <Modal size="sm" show={exibeCarregando} onHide={() => setExibeCarregando(false)} aria-labelledby="example-modal-sizes-title-sm" >        
        <Modal.Body>
          <Spinner animation="border" role="status"></Spinner>&nbsp;<span >Por favor aguarde, processando!</span>       
        </Modal.Body>
      </Modal>

      <Modal show={exibirMensagemExclusao} onHide={() => { setExibirMensagemExclusao(false) }} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Excluir</Modal.Title>
        </Modal.Header>
        <Modal.Body>Você tem certeza que deseja excluir este item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={ () => { setExibirMensagemExclusao(false) } }>
            Fechar
          </Button>
          <Button variant="primary" onClick={ () => {confirmarExclusao()} }>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>

      </section>
    </div>
  );
}

export default agendaView;
