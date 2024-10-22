import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthClient } from "@dfinity/auth-client";
import { useState, useEffect } from 'react';
import { web3eap_backend } from 'declarations/web3eap_backend';
import { Table, Button, Form, Stack, Modal, Navbar, Nav, Badge, Container, Spinner, Row, Col } from 'react-bootstrap';
import moment from 'moment';

  // funcão para desconectar da rede da ICP
  async function handleLogout(){
    const authClient = await AuthClient.create();  
    // Força o logout e direciona para a página de login
    await authClient.logout();     
    window.location.href = '/';
  };

  function projectView() {   
    const [exibeCarregando, setExibeCarregando] = useState(false); // constante utilizada para apresentar modal com mensagem de carregamento da página
    const [showPopupProjeto, setShowPopupProjeto] = useState(false);  // constante utilizada para apresentar o popup de cadastro de novo projeto
    
    //Constantes utilizadas na popup que será apresentada para cadastro de novos projetos
    const [nomeProjetoPopup, setNomeProjetoPopup] = useState('');  
    const [horasEstimadasPopup, setHorasEstimadasPopup] = useState('');
    const [dataInicioPopup, setDataInicioPopup] = useState(new Date());
    const [dataConclusaoPopup, setDataConclusaoPopup] = useState(new Date());
    const [situacaoPopup, setSituacaoPopup] = useState('');
    
    const [projetos, setProjetos] = useState([]); // array utilizado para armazenar os projetos que são apresentados na tela 
    
    const handleClosePopupCadastrarProjeto = () => setShowPopupProjeto(false);  // constante utilizada para fechar a popup de cadastro de projetos

    const [exibirMensagemAlerta, setExibirMensagemAlerta] = useState(false);
    const [mensagemAlerta, setMensagemAlerta] = useState(false);

    // Esta função é utilizada para direcionar para a tela que irá permitir cadastrar e manter a EAP do projeto
    function linkEap(idProjeto){      
      window.location.href = '/eapLink/'+idProjeto;
    }

    useEffect( async () => {    
      /* Ao carregar a página serão apresentados todos os projetos cadastrados. Esta função deverá ser aprimorada para pesquisar apenas 
         os projetos que o ICP IDENTITY que acessou o sistema possui permissão */
      let response = await web3eap_backend.getArrayProjetos();   
      setProjetos(response);     
    }, []); 

    
    const handleNomeProjetoPopup = (event) => {
      setNomeProjetoPopup(event.target.value);
    };

    const handleHorasEstimadasPopup = (event) => {
      setHorasEstimadasPopup(event.target.value);
    };

    const handleDataInicioPopup = (event) => {
      setDataInicioPopup(event.target.value);
    };

    const handleDataConclusaoPopup = (event) => {
      setDataConclusaoPopup(event.target.value);
    };

    const handleSituacaoPopup = (event) => {
      setSituacaoPopup(event.target.value);
    };

    async function salvarProjeto() {        
      
      if(nomeProjetoPopup == null || nomeProjetoPopup.trim()==''){            
        setMensagemAlerta("É obrigatório informar um nome para o projeto");
        setExibirMensagemAlerta(true);      
      } else {

        setShowPopupProjeto(false);    
        setExibeCarregando(true);    
        // as variaveis dti e dtc são utilizadas para obter o timestamp correspondente as datas de início e fim do projeto.
        let dti = new Date(dataInicioPopup);
        let dtc = new Date(dataConclusaoPopup);
          
        // chamada para função do backend responsavel por gravar os projetos
        await web3eap_backend.cadastrarProjeto(nomeProjetoPopup, horasEstimadasPopup, dti.getTime()+'', dtc.getTime()+'', situacaoPopup);
        let response = await web3eap_backend.getArrayProjetos();   
        setProjetos(response);        
        setNomeProjetoPopup('');
        setExibeCarregando(false);    

      }
    }   

    // função utilizada para exibir a popup utilizada para cadastrar novos projetos
    async function abrirPopupCadastroProjeto() {   
      setShowPopupProjeto(true);    
    }   

  return (    

    <div>       

        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Collapse id="navbarScroll">              
              <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll >
                <Nav.Link  onClick={abrirPopupCadastroProjeto} >Adicionar Projeto</Nav.Link>      
                <Nav.Link>|</Nav.Link>                                           
              </Nav>
              <Form className="d-flex">
                <Form.Control type="search" placeholder="Pesquisar Projeto" className="me-2" aria-label="Search" />
                <Button variant="light">Pesquisar</Button>
              </Form>
              <Button variant="light" onClick={() => {handleLogout()}} >Sair</Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>

      <br/><br/>
      <section id="projeto">       

        <Table striped bordered hover>
          <thead>
            <th style={{ width: '5%' }} >Ação</th>
            <th style={{ width: '50%' }}>Nome Projeto</th>            
            <th style={{ width: '10%' }}>Horas Estimadas</th>            
            <th style={{ width: '10%' }}>Data de Início</th>            
            <th style={{ width: '10%' }}>Data de Conclusão</th>            
            <th style={{ width: '15%' }}>Situação</th>            
          </thead>

          <tbody>
          {   
              projetos.map((linha) => 
                  <tr>
                      <td>
                          <Stack direction="horizontal" gap={0}>                                                

                              <div className="p-1">
                                  <Button  variant="outline-secondary" onClick={ () => { excluirItem(linha.nomeProjeto) } } >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                      <path d="M4 7l16 0" />
                                      <path d="M10 11l0 6" />
                                      <path d="M14 11l0 6" />
                                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                    </svg>
                                  </Button>
                              </div>

                              <div className="p-1">
                                <Button  variant="outline-secondary" onClick={ () => { abrirPopupEditar(linha.nomeProjeto ) } } >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil" >
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                      <path d="M13.5 6.5l4 4" />
                                    </svg>
                                </Button>
                              </div>

                              <div className="p-1">
                                <Button  variant="outline-secondary" onClick={ () => { linkEap(linha.nomeProjeto) } }>EAP</Button>
                              </div>                              
                          </Stack>
                      </td>
                      <td>{linha.nomeProjeto}</td>
                      <td>{linha.horasEstimadas}</td>                            
                      <td>{linha.dataInicio ? moment(new Date(parseInt(linha.dataInicio ))).utc().format('DD/MM/YYYY') : '' }</td>      
                      <td>{linha.dataConclusao ? moment(new Date(parseInt(linha.dataConclusao))).utc().format('DD/MM/YYYY') : '' }</td>      
                      <td>
                          { linha.situacao=='1'? <Badge bg="warning" text="dark">Aguardando Inicio</Badge> :''}
                          { linha.situacao=='2'? <Badge bg="primary">Em Execusão</Badge>:''}
                          { linha.situacao=='3'? <Badge bg="danger">Paralizada</Badge> :''}       
                          { linha.situacao=='4'? <Badge bg="success">Concluída</Badge>:''}     
                      </td>                                         
                  </tr>
              )
          }    
        </tbody>

      </Table>        
      
      <Modal show={showPopupProjeto} >
          <Modal.Header closeButton>
            <Modal.Title>Criar Projeto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>       
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="popup.atividade">
                    <Form.Label>Nome do Projeto*</Form.Label>
                    <Form.Control value={nomeProjetoPopup} onChange={handleNomeProjetoPopup} type="text" />
                  </Form.Group>   
                </Col>                
              </Row> 
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="dataInicio">
                      <Form.Label >Data de Início</Form.Label>
                      <Form.Control type="date" size="sm" placeholder=""  value={dataInicioPopup} onChange={handleDataInicioPopup} />
                  </Form.Group>
                </Col>
                <Col>
                <Form.Group className="mb-3" controlId="dataConclusao">
                    <Form.Label >Data de Conclusão</Form.Label>
                    <Form.Control type="date" size="sm"  placeholder=""  value={dataConclusaoPopup} onChange={handleDataConclusaoPopup} />
                </Form.Group>
                </Col>
              </Row>
              
              <Row> 
                <Col>
                  <Form.Group className="mb-3" controlId="horas">
                      <Form.Label >Horas Estimadas</Form.Label>
                      <Form.Control type="text" size="sm" placeholder=""  value={horasEstimadasPopup} onChange={handleHorasEstimadasPopup} />
                  </Form.Group>
                </Col>
                <Col>
                <Form.Group className="mb-3" controlId="situacao">
                          <Form.Label >Situação do Projeto</Form.Label>
                          <Form.Select aria-label="Selecione" size="sm" value={situacaoPopup} onChange={handleSituacaoPopup} >
                            <option>Selecione</option>                  
                            <option value="1">Aguardando Inicio</option>
                            <option value="2">Em Execusão</option>
                            <option value="3">Paralizada</option>
                            <option value="4">Concluída</option>                            
                          </Form.Select>                      
                        </Form.Group>                       
                </Col>
              </Row>                                                                   
                
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePopupCadastrarProjeto}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={salvarProjeto}>
              Confirmar Cadastro
            </Button>
          </Modal.Footer>
      </Modal>   

      <Modal size="sm" show={exibeCarregando} onHide={() => setExibeCarregando(false)} aria-labelledby="example-modal-sizes-title-sm" >        
        <Modal.Body>
          <Spinner animation="border" role="status"></Spinner>&nbsp;<span >Por favor aguarde, processando!</span>       
        </Modal.Body>
      </Modal>

      <Modal size="sm" show={exibirMensagemAlerta} onHide={() => { setExibirMensagemAlerta(false) }} aria-labelledby="contained-modal-title-vcenter" >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Alerta!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>          
          {mensagemAlerta}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ () => { setExibirMensagemAlerta(false)} }>OK</Button>
        </Modal.Footer>
      </Modal>

      </section>      
                
    </div>
  );
}

export default projectView;
