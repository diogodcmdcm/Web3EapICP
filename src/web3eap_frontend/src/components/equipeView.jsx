import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { createActor, web3eap_backend } from 'declarations/web3eap_backend';
import { Table, Button, Form, Stack, Modal, Navbar, Nav, Card, Container, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import {AuthClient} from "@dfinity/auth-client"
import {HttpAgent} from "@dfinity/agent";

let actorWeb3EAPBackend = web3eap_backend;

function equipeView() { 
  
  const { idProjeto, nomeProjeto } = useParams(); //constante utilizada para armazenar o id do projeto recebido ao abrir a página.
  
  useEffect( async () => {     

    setExibeCarregando(true); // exibe mensagem carregando enquanto o sistema obtem a lista de equipe no backend

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

        //chamada para o backend para buscar as pessoas já cadastradas
        let idP = parseInt(idProjeto);
        let response = await actorWeb3EAPBackend.getArrayEquipe(idP);      
        setEquipe(response[0]);            
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
  
  const [showPopupAdicionar, setShowPopupAdicionar] = useState(false);  // constante utilizada para apresentar a popup de cadastro de equipe
  const [showPopupEditar, setShowPopupEditar] = useState(false);  // constante utilizada para apresentar a popup de alteração de equipe
  const [equipe, setEquipe] = useState([]); // constante utilizada para armazenar os itens da EAP que são apresentados na tela 
              
  //Constantes utilizadas na popup que será apresentada para cadastro de novas pessoas 
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  
  //Constantes utilizadas na popup que será apresentada para edição de novas pessoas 
  const [idItemPopup, setIdItemPopup] = useState('');
  const [nomePopup, setNomePopup] = useState('');
  const [cargoPopup, setCargoPopup] = useState('');
  
  const [exibeCarregando, setExibeCarregando] = useState(false); // constante utilizada para apresentar modal com mensagem de carregamento da página
  const [exibirMensagemExclusao, setExibirMensagemExclusao] = useState(false);  // constante utilizada para apresentar modal com mensagem de confirmação de exclusão de item
  const [idExcluir, setIdExcluir] = useState(null);  // constante utilizada para guardar o id do item selecionado para exclusão.

  //Função utilizada para adicionar uma nova pessoa na equipe
  async function adicionarItem() {        
    
    if(nome == null || nome.trim()==''){
      alert("Informe o nome completo");
    } else if(cargo == null || cargo.trim()==''){
      alert("Informe o cargo");
    } else {
      setShowPopupAdicionar(false);
      setExibeCarregando(true);
      //chamada para o backend para adicionar a nova pessoa
      let idP = parseInt(idProjeto);
      await actorWeb3EAPBackend.addEquipe(idP, nome, cargo);
      //chamada para o backend, serão retornadas as pessoas cadastradas 
      let response = await actorWeb3EAPBackend.getArrayEquipe(idP);
      setEquipe(response[0]);
      setExibeCarregando(false);
      limparCampos();
    }    
        
  } 

  function limparCampos(){    
    setNome(''); 
    setCargo('');           
  }

  // função utilizada para excluir um pessoa 
  async function excluirItem() { 
      setExibeCarregando(true);
      let idP = parseInt(idProjeto);
      let idE = parseInt(idExcluir);
      await actorWeb3EAPBackend.excluirEquipe(idP, idE);
      let response = await actorWeb3EAPBackend.getArrayEquipe(idP);
      setEquipe(response[0]);
      setExibeCarregando(false);
  }

  // função utilizada para apresentar mensagem de confirmação de exclusão de um item
  function exibirMensagemExcluir(id){
    setExibirMensagemExclusao(true);
    setIdExcluir(id);
  }

  // função para confirmar a exclusão de um item
  function confirmarExclusao(){
    setExibirMensagemExclusao(false);    
    excluirItem();
  }
               
  // função utilizada para apresentar a popup para edição de uma pessoa
  async function abrirPopupEditar(idItem, nome, cargo) {
      setShowPopupEditar(true);    
      setIdItemPopup(idItem);
      setNomePopup(nome);
      setCargoPopup(cargo);
  }

  // função utilizada para registrar a alteração realizada em uma pessoa
  async function salvarAlteracao() {        

    if(nomePopup == null || nomePopup.trim()==''){
      alert("Informe o nome completo");
    } else if(cargoPopup == null || cargoPopup.trim()==''){
      alert("Informe o cargo");
    } else {     
      setShowPopupEditar(false);    
      setExibeCarregando(true);

      let idP = parseInt(idProjeto);
      let idA = parseInt(idItemPopup);

      await actorWeb3EAPBackend.alterarEquipe(idP, idA, nomePopup, cargoPopup);
      let response = await actorWeb3EAPBackend.getArrayEquipe(idP);
      setEquipe(response[0]);            
      setIdItemPopup('');
      setNomePopup(''); 
      setCargoPopup(''); 
      setExibeCarregando(false);
    }

  }        

  const handleNome = (event) => {
    setNome(event.target.value);
  };
  
  const handleCargo = (event) => {
    setCargo(event.target.value);
  };
  
  const handleNomePopup = (event) => {
    setNomePopup(event.target.value);
  };
  
  const handleCargoPopup = (event) => {
    setCargoPopup(event.target.value);
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
              <Nav.Link  href={'/eapLink/'+idProjeto+'/'+nomeProjeto} >EAP do Projeto</Nav.Link>                                        
              <Nav.Link>|</Nav.Link>    
              <Nav.Link  href={'/equipeLink/'+idProjeto+'/'+nomeProjeto} >Equipe do Projeto</Nav.Link>                                        
              <Nav.Link>|</Nav.Link>
              <Nav.Link  href={'/agendaLink/'+idProjeto+'/'+nomeProjeto} >Agenda da Equipe</Nav.Link>                
              <Nav.Link>|</Nav.Link>
              <Nav.Link  href={'/calendarioEquipeLink/'+idProjeto+'/'+nomeProjeto} >Calendário da Equipe</Nav.Link>                
              <Nav.Link>|</Nav.Link>
              <Nav.Link  href={'/calendarioProjetoLink/'+idProjeto+'/'+nomeProjeto} >Calendário do Projeto</Nav.Link>              
            </Nav>              
            <Button onClick={handleLogout} variant="light">Sair</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
         
      <Card>
        <Card.Body>{nomeProjeto} / Equipe do Projeto</Card.Body>
      </Card>      

      <br/>
      <section id="eap">
        <Table striped bordered hover>
          <thead>
            <th>Ação</th>
            <th>Nome</th>
            <th>Cargo/Função</th>            
          </thead>

          <tbody>
            <tr>
                <td>
                    <Stack direction="horizontal" gap={0}>   
                        <div className="p-1">
                            <Button onClick={ () => { abrirPopupAdicionar() } } variant="outline-secondary" >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                                <path d="M9 12h6" />
                                <path d="M12 9v6" />
                              </svg>
                            </Button>
                        </div>                      
                    </Stack>
                </td>
                <td>Clique no botão + para adicionar uma nova pessoa da equipe.</td>
                <td></td>                            
            </tr>          
          {   
              equipe.map((linha) => 
                  <tr>
                      <td>
                          <Stack direction="horizontal" gap={0}>                             

                          { (linha.cargo != '') && <div className="p-1">
                                  <Button onClick={ () => { exibirMensagemExcluir(linha.id) } }   variant="outline-secondary" >
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
                          { (linha.cargo != '') &&  <div className="p-1">
                                <Button onClick={ () => { abrirPopupEditar(linha.id, linha.nome, linha.cargo ) } }  variant="outline-secondary" >
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
                      <td><pre>{linha.cargo}</pre></td>                            
                  </tr>
              )
          }    
        </tbody>

        </Table>
    
        <Modal show={showPopupAdicionar} onHide={handleClosePopupAdicionar} backdrop="static" keyboard={false} >
          <Modal.Header closeButton>
            <Modal.Title>Adicionar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
                <Form.Group className="mb-3" controlId="nome">
                    <Form.Label>Informe o nome completo*</Form.Label>
                    <Form.Control type="text"  placeholder=""  value={nome} onChange={handleNome}  />
                </Form.Group>                    
            
                <Form.Group className="mb-3" controlId="cargo">
                    <Form.Label>Informe o cargo/função*</Form.Label>
                    <Form.Control type="text"  placeholder=""  value={cargo} onChange={handleCargo}  />
                </Form.Group>                
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePopupAdicionar}>Cancelar</Button>
            <Button variant="primary" onClick={adicionarItem} >Salvar Alterações</Button>
          </Modal.Footer>
      </Modal>        


        <Modal show={showPopupEditar} onHide={handleClosePopupEditar} backdrop="static" keyboard={false} >
          <Modal.Header closeButton>
            <Modal.Title>Editar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="popup.nome">
                <Form.Label>Nome Completo*</Form.Label>
                <Form.Control value={nomePopup} onChange={handleNomePopup} type="text" placeholder="" autoFocus />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.cargo">
                <Form.Label>Cargo/Função*</Form.Label>
                <Form.Control value={cargoPopup} onChange={handleCargoPopup} type="text" />
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

export default equipeView;
