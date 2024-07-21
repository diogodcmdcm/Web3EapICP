import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { web3eap_backend } from 'declarations/web3eap_backend';
import { Table, Button, Nav, Form, Stack, Modal } from 'react-bootstrap';
import { Link , useNavigate} from 'react-router-dom';

function projectView() {
 
  const navigate = useNavigate();

  function linkEap(idProjeto){      
    window.location.href = '/eapLink/'+idProjeto;
  }

  useEffect( async () => {
    
    let response = await web3eap_backend.getArrayProjetos();   
    setProjetos(response);   
  
  }, []);
  
  const [showPopupProjeto, setShowPopupProjeto] = useState(false);  
  const [nomeProjetoPopup, setNomeProjetoPopup] = useState('');
  const [projetos, setProjetos] = useState([]);
  
  const handleClosePopupCadastrarProjeto = () => setShowPopupProjeto(false);  

  const handleNomeProjetoPopup = (event) => {
    setNomeProjetoPopup(event.target.value);
  };

  async function salvarProjeto() {        
        
    await web3eap_backend.cadastrarProjeto(nomeProjetoPopup);
    let response = await web3eap_backend.getArrayProjetos();   
    setProjetos(response);    
    setShowPopupProjeto(false);    

  }   

  async function abrirPopupCadastroProjeto() {   
    setShowPopupProjeto(true);    
  }  

  return (
    <div>       
      <Stack direction="horizontal" gap={3}>
         <div className="p-2"> <Button variant="outline-primary" onClick={abrirPopupCadastroProjeto} >Adicionar Projeto</Button>{' '}</div>              
         <div className="p-2 ms-auto"><Nav.Link as={Link} to='/eapLink'> <Button variant="outline-primary">Conectar Wallet</Button></Nav.Link></div>
      </Stack>
        
      <br/><br/>
      <section id="projeto">       

        <Table striped bordered hover>
          <thead>
            <th style={{ width: '5%' }} >Ação</th>
            <th style={{ width: '95%' }}>Nome Projeto</th>            
          </thead>

          <tbody>
          {   
              projetos.map((linha) => 
                  <tr>
                      <td>
                          <Stack direction="horizontal" gap={0}>                                                

                              <div className="p-1">
                                  <Button onClick={ () => { excluirItem(linha) } } >
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
                                <Button onClick={ () => { abrirPopupEditar(linha ) } } >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil" >
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                      <path d="M13.5 6.5l4 4" />
                                    </svg>
                                </Button>
                              </div>

                              <div className="p-1">
                                <Button onClick={ () => { linkEap(linha) } }>EAP</Button>
                              </div>                              
                          </Stack>
                      </td>
                      <td>{linha}</td>
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
              <Form.Group className="mb-3" controlId="popup.atividade">
                <Form.Label>Nome do Projeto</Form.Label>
                <Form.Control value={nomeProjetoPopup} onChange={handleNomeProjetoPopup} type="text" />
              </Form.Group>              
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

      </section>      
                
    </div>
  );
}

export default projectView;
