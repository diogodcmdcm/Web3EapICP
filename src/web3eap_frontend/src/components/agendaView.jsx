import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { createActor, web3eap_backend } from 'declarations/web3eap_backend';
import { Table, Button, Form, Stack, Modal, Navbar, Nav, Card, Container, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import {AuthClient} from "@dfinity/auth-client"
import {HttpAgent} from "@dfinity/agent";

let actorWeb3EAPBackend = web3eap_backend;

function agendaView() { 
  
  const { idProjeto } = useParams(); //constante utilizada para armazenar o id do projeto recebido ao abrir a página.
  
  useEffect( async () => {     
        
    setExibeCarregando(true);

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

        // o retorno desta requisição efetuada para o backend irá servir para preencher as opções do combobox de pessoas  
        let idP = parseInt(idProjeto);
        let responseEquipe = await actorWeb3EAPBackend.getArrayEquipe(idP);    
        setEquipeOpcoes(responseEquipe[0]);    

        // o retorno desta requisição efetuada para o backend irá servir para preencher as opções do combobox de atividades  
        let responseAtividade = await actorWeb3EAPBackend.getArrayItensEAP(idP);    
        setAtividadeOpcoes(responseAtividade[0]);
        
        let response = await actorWeb3EAPBackend.getArrayAgendaEquipe(idP);    
        setAgendaEquipe(response[0]);  
        setExibeCarregando(false);
      } else {
        setExibeCarregando(false);
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

  const [showPopupAdicionar, setShowPopupAdicionar] = useState(false);  
  const [showPopupEditar, setShowPopupEditar] = useState(false);  
  const [agendaEquipe, setAgendaEquipe] = useState([]);
  const [equipeOpcoes, setEquipeOpcoes] = useState([]);
  const [atividadeOpcoes, setAtividadeOpcoes] = useState([]);
              
  //Constantes utilizadas na popup que será apresentada para cadastro de novas agendas 
  const [nome, setNome] = useState('');
  const [atividade, setAtividade] = useState('');
  const [data, setData] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaConclusao, setHoraConclusao] = useState('');

  //Constantes utilizadas na popup que será apresentada para editar agenda 
  const [idItemPopup, setIdItemPopup] = useState('');
  const [nomePopup, setNomePopup] = useState('');
  const [atividadePopup, setAtividadePopup] = useState('');
  const [dataPopup, setDataPopup] = useState('');
  const [horaInicioPopup, setHoraInicioPopup] = useState('');
  const [horaConclusaoPopup, setHoraConclusaoPopup] = useState('');  

  const [exibeCarregando, setExibeCarregando] = useState(false); // constante utilizada para apresentar modal com mensagem de carregamento da página
  const [exibirMensagemExclusao, setExibirMensagemExclusao] = useState(false);  // constante utilizada para apresentar modal com mensagem de confirmação de exclusão de item
  const [idExcluir, setIdExcluir] = useState(null);  // constante utilizada para guardar o id da agenda selecionada para exclusão.

  //Função utilizada para adicionar uma nova agenda
  async function adicionarItem() {        
    
    if(nome == null || nome.trim()==''){
      alert("É obrigatório selecionar uma pessoa!");
    } else if(atividade == null || atividade.trim()==''){
      alert("É obrigatório informar a atividade!");
    } else if(data == null || data.trim()==''){
      alert("É obrigatório informar a data!");
    } else if(horaInicio == null || horaInicio.trim()==''){
      alert("É obrigatório informar a hora de início!");
    } else if(horaConclusao == null || horaConclusao.trim()==''){
      alert("É obrigatório informar a hora de conclusão!");  
    } else {

      setExibeCarregando(true);
      setShowPopupAdicionar(false);
      let idP = parseInt(idProjeto);
      await actorWeb3EAPBackend.addAgendaEquipe(idP, nome, atividade, data, horaInicio, horaConclusao);                                            
      let response = await actorWeb3EAPBackend.getArrayAgendaEquipe(idP);
    
      setAgendaEquipe(response[0]);            
      limparCampos();

    }            
  } 

  function limparCampos(){
    setNome(''); 
    setAtividade(''); 
    setData(''); 
    setHoraInicio(''); 
    setHoraConclusao(''); 
    setExibeCarregando(false);

    setIdItemPopup('');
    setNomePopup(''); 
    setAtividadePopup(''); 
    setDataPopup(''); 
    setHoraInicioPopup(''); 
    setHoraConclusaoPopup(''); 
    setExibeCarregando(false);

  }

  // função utilizada para excluir uma agenda
  async function excluirItem() { 
    setExibeCarregando(true);
    let idP = parseInt(idProjeto);
    let idE = parseInt(idExcluir);
    await actorWeb3EAPBackend.excluirAgendaEquipe(idP, idE);
    let response = await actorWeb3EAPBackend.getArrayAgendaEquipe(idP);
    setAgendaEquipe(response[0]);
    setExibeCarregando(false);
  }

  // função utilizada para apresentar mensagem de confirmação de exclusão da agenda
  function exibirMensagemExcluir(id){
    setExibirMensagemExclusao(true);
    setIdExcluir(id);
  }

  // função para confirmar a exclusão de uma agenda
  function confirmarExclusao(){
    setExibirMensagemExclusao(false);    
    excluirItem();
  }
  
  // função utilizada para apresentar a popup para edição de uma agenda
  async function abrirPopupEditar(idItem, nome, atividade, data, horaInicio, horaConclusao) {   
      setShowPopupEditar(true);    
      setIdItemPopup(idItem);
      setNomePopup(nome);
      setAtividadePopup(atividade);
      setDataPopup(data);
      setHoraInicioPopup(horaInicio);
      setHoraConclusaoPopup(horaConclusao);
  }

  // função utilizada para registrar a alteração realizada em uma agenda
  async function salvarAlteracao() {        

    if(nomePopup == null || nomePopup.trim()==''){
      alert("É obrigatório selecionar uma pessoa!");
    } else if(atividadePopup == null || atividadePopup.trim()==''){
      alert("É obrigatório selecionar uma atividade!");
    } else if(dataPopup == null || dataPopup.trim()==''){
      alert("É obrigatório informar a data!");
    } else if(horaInicioPopup == null || horaInicioPopup.trim()==''){
      alert("É obrigatório informar a hora de início!");
    } else if(horaConclusaoPopup == null || horaConclusaoPopup.trim()==''){
      alert("É obrigatório informar a hora de conclusão!");
    } else {     

      setShowPopupEditar(false);    
      setExibeCarregando(true);
      let idP = parseInt(idProjeto);
      let idI = parseInt(idItemPopup);
      await actorWeb3EAPBackend.alterarAgendaEquipe(idP, idI, nomePopup, atividadePopup, dataPopup, horaInicioPopup, horaConclusaoPopup);
      let response = await actorWeb3EAPBackend.getArrayAgendaEquipe(idP);
      
      setAgendaEquipe(response[0]);     
      limparCampos();
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
              <Button onClick={handleLogout} variant="light">Sair</Button>
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
    
        <Modal show={showPopupAdicionar} onHide={handleClosePopupAdicionar} backdrop="static" keyboard={false} >
          <Modal.Header closeButton>
            <Modal.Title>Adicionar Agenda</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
                <Form.Group className="mb-3" controlId="codigo">
                    <Form.Label>Informe a pessoa*</Form.Label>
                    <Form.Select aria-label="Selecione" value={nome} onChange={handleNome} >
                      <option>Selecione</option>                  
                      {   
                        equipeOpcoes.slice(1).map((op) =>
                          <option value={op.nome}>{op.nome}</option> 
                      )}
                    </Form.Select>                      
                </Form.Group>                    
            
                <Form.Group className="mb-3" controlId="atividade">
                    <Form.Label>Informe a Atividade*</Form.Label>
                    <Form.Select aria-label="Selecione" value={atividade} onChange={handleAtividade} >
                      <option>Selecione</option>                                        
                      {   
                        atividadeOpcoes.slice(1).map((op) =>
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

        <Modal show={showPopupEditar} onHide={handleClosePopupEditar} backdrop="static" keyboard={false} >
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
      
      <Modal size="sm" show={exibeCarregando} onHide={() => setExibeCarregando(false)} backdrop="static" keyboard={false} aria-labelledby="example-modal-sizes-title-sm" >        
        <Modal.Body>
          <Spinner animation="border" role="status"></Spinner>&nbsp;<span >Por favor aguarde, processando!</span>       
        </Modal.Body>
      </Modal>

      <Modal show={exibirMensagemExclusao} onHide={() => { setExibirMensagemExclusao(false) }} backdrop="static" keyboard={false} animation={false}>
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
