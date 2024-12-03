import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { createActor, web3eap_backend } from 'declarations/web3eap_backend';
import { Table, Button, Form, Stack, Modal, Navbar, Nav, Badge, Card, Container, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import {AuthClient} from "@dfinity/auth-client"
import {HttpAgent} from "@dfinity/agent";

let actorWeb3EAPBackend = web3eap_backend;

function eapView() { 
  
  const { idProjeto } = useParams(); //constante utilizada para armazenar o id do projeto recebido ao abrir a página.

  useEffect( async () => {   
    setExibeCarregando(true); // exibe mensagem carregando enquanto o sistema obtem a lista da EAP no backend


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

        //chamada para o backend para buscar os itens da EAP já cadastrados
        const idProjetoNat = Number(idProjeto);
        let response = await actorWeb3EAPBackend.getArrayItensEAP(idProjetoNat);
        if(response[0]!=null&&response[0]!=''){
          let eapOrdenada = response[0].sort((a,b) => (a.codigo.replace(/\./g, '')) - (b.codigo.replace(/\./g, '')) ); // função para ordenar o array 
          let eapFormatada = formatarEAP(eapOrdenada); 
          setEap(eapFormatada);   
        }        
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
  
  const [showPopupAdicionar, setShowPopupAdicionar] = useState(false);  // constante utilizada para apresentar a popup de cadastro de item da EAP
  const [showPopupEditar, setShowPopupEditar] = useState(false);        // constante utilizada para apresentar a popup de alteração de item da EAP
  
  const [eap, setEap] = useState([]); // constante utilizada para armazenar os itens da EAP que são apresentados na tela 
              
  //Constantes utilizadas na popup que será apresentada para cadastro de novos itens da EAP 
  const [codigo, setCodigo] = useState('');
  const [atividade, setAtividade] = useState('');
  const [horas, setHoras] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataConclusao, setDataConclusao] = useState('');
  const [situacao, setSituacao] = useState('');

  //Constantes utilizadas na popup que será apresentada para editar itens da EAP 
  const [idItemPopup, setIdItemPopup] = useState('');
  const [codigoPopup, setCodigoPopup] = useState('');
  const [atividadePopup, setAtividadePopup] = useState('');
  const [horasPopup, setHorasPopup] = useState('');
  const [dataInicioPopup, setDataInicioPopup] = useState('');
  const [dataConclusaoPopup, setDataConclusaoPopup] = useState('');
  const [situacaoPopup, setSituacaoPopup] = useState('');

  const [exibeCarregando, setExibeCarregando] = useState(false); // constante utilizada para apresentar modal com mensagem de carregamento da página
  const [exibirMensagemExclusao, setExibirMensagemExclusao] = useState(false);  // constante utilizada para apresentar modal com mensagem de confirmação de exclusão de item
  const [idExcluir, setIdExcluir] = useState(null);  // constante utilizada para guardar o id do item selecionado para exclusão.

  const [exibirMensagemAlerta, setExibirMensagemAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState(false);
  
  //Função utilizada para adicionar um novo item na lista da EAP
  async function adicionarItem() {        
    
    if(codigo == null || codigo.trim()==''){            
      setMensagemAlerta("É obrigatório informar o código");
      setExibirMensagemAlerta(true);
    } else if(atividade == null || atividade.trim()==''){
      setMensagemAlerta("É obrigatório informar a atividade");
      setExibirMensagemAlerta(true);
    } else {

      setExibeCarregando(true);
      setShowPopupAdicionar(false);
      //chamada para o backend para adicionar o item na EAP do projeto
      const idProjetoNat = Number(idProjeto);
      await actorWeb3EAPBackend.addItemNoArray(idProjetoNat, codigo, atividade, horas, dataInicio, dataConclusao, situacao);
      //chamada para o backend, serão retornados os itens da EAP 
      let response = await actorWeb3EAPBackend.getArrayItensEAP(idProjetoNat);
    
      //chamada para função que irá formatar a lista da EAP (organizar por código e adicionar . para expressar a hierarquia)
      let eapFormatada = formatarEAP(response[0]); 

      // atualizar a EAP apresentada na tela
      setEap(eapFormatada);      
      
      //limpa os campos para preparar a tela para um novo cadastro
      limparCamposPopupCadastro();
      setExibeCarregando(false);

    }    
        
  } 

  //função utilizada para limpar os campos da popup utilizada para cadastrar novo itens na EAP
  function limparCamposPopupCadastro(){
    setCodigo(''); 
    setAtividade(''); 
    setHoras(''); 
    setDataInicio(''); 
    setDataConclusao(''); 
    setSituacao('');

    setIdItemPopup('');
    setCodigoPopup(''); 
    setAtividadePopup(''); 
    setHorasPopup(''); 
    setDataInicioPopup(''); 
    setDataConclusaoPopup(''); 
    setSituacaoPopup('');

  }

  // função utilizada para excluir um item da EAP 
  async function excluirItem() { 
      
      setExibeCarregando(true);
      const idProjetoNat = Number(idProjeto);
      const idExcluirNat = Number(idExcluir);
      await actorWeb3EAPBackend.excluirItem(idProjetoNat, idExcluirNat);
      let response = await actorWeb3EAPBackend.getArrayItensEAP(idProjetoNat);
      setIdExcluir(null);
      let eapFormatada = formatarEAP(response[0]);       
      setEap(eapFormatada);
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
                                   
  // função utilizada para apresentar a popup para edição de um item da EAP
  async function abrirPopupEditar(idItem, codigo, atividade, horas, dataInicio, dataConclusao, situacao) {
   
      atividade = atividade.replace(/\./g, '');
      atividade = atividade.trim();

      setShowPopupEditar(true);    
      setIdItemPopup(idItem);
      setCodigoPopup(codigo);
      setAtividadePopup(atividade);
      setHorasPopup(horas);
      setDataInicioPopup(dataInicio);
      setDataConclusaoPopup(dataConclusao);
      setSituacaoPopup(situacao);

  }

  // função utilizada para registrar a alteração realizada em um item da EAP.
  async function salvarAlteracao() {        

    if(codigoPopup == null || codigoPopup.trim()==''){      
      setMensagemAlerta("É obrigatório informar o código");
      setExibirMensagemAlerta(true);
    } else if(atividadePopup == null || atividadePopup.trim()==''){      
      setMensagemAlerta("É obrigatório informar a atividade");
      setExibirMensagemAlerta(true);
    } else {     

      setShowPopupEditar(false);    
      setExibeCarregando(true);
      const idProjetoNat = Number(idProjeto);
      const idItemPopupNat = Number(idItemPopup);
      await actorWeb3EAPBackend.alterarItemEAP(idProjetoNat, idItemPopupNat,codigoPopup, atividadePopup, horasPopup, dataInicioPopup, dataConclusaoPopup, situacaoPopup);
      let response = await actorWeb3EAPBackend.getArrayItensEAP(idProjetoNat);

      let eapFormatada = formatarEAP(response[0]);       
      setEap(eapFormatada);    

      limparCamposPopupCadastro();
      setExibeCarregando(false);

    }

  }        

  // função utilizada para ordenar os itens da EAP
  function formatarEAP(eapForm){    

    let eapOrdenada = eapForm.sort((a,b) => (a.codigo.replace(/\./g, '')) - (b.codigo.replace(/\./g, '')) ); // funcao para ordenar o array 

      for(let i = 0 ; i < eapOrdenada.length ; i++){
        eapOrdenada[i].atividade = formatarAtividade(eapOrdenada[i].codigo, eapOrdenada[i].atividade);
      }

      return eapOrdenada
  }
  
  // função utilizada para formatar a hierarquia das contas utilizando . (ponto)
  function formatarAtividade(codigo, at){

    let espacos = '';

    codigo = codigo + '.';
    let index = codigo.indexOf('.');    
    let num = codigo.substring(0, index).replace(/\./g, '');
    
    if(num>0){
      espacos = espacos + " . ";
    }

    let sub = codigo;
    while(num>0){
      sub = sub.substring(index+1,sub.length);    
      index = sub.indexOf('.');          
      num = sub.substring(0, index).replace(/\./g, '');
      if(num>0){
        espacos = espacos + ' . ';
      }

    }    
    return espacos + at;
  }

  const handleCodigo = (event) => {
    setCodigo(event.target.value);
  };
  
  const handleAtividade = (event) => {
    setAtividade(event.target.value);
  };

  const handleHoras = (event) => {
    setHoras(event.target.value);
  };

  const handleDataInicio = (event) => {
    setDataInicio(event.target.value);
  };

  const handleDataConclusao = (event) => {
    setDataConclusao(event.target.value);
  };

  const handleSituacao = (event) => {
    setSituacao(event.target.value);
  };

  const handleCodigoPopup = (event) => {
    setCodigoPopup(event.target.value);
  };
  
  const handleAtividadePopup = (event) => {
    setAtividadePopup(event.target.value);
  };

  const handleHorasPopup = (event) => {
    setHorasPopup(event.target.value);
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
        <Card.Body>{idProjeto} / EAP do Projeto</Card.Body>
      </Card>  
        
      <section id="eap">
        <Table striped bordered hover>
          <thead>
            <th>Ação</th>
            <th>Código</th>
            <th>Atividade</th>
            <th>Horas</th>
            <th>Data Início</th>
            <th>Data Conclusão</th>
            <th>Situação</th>
          </thead>

          <tbody>
          {   
              eap.map((linha) => 
                  <tr>
                      <td>
                          <Stack direction="horizontal" gap={0}>   

                          { (linha.codigo == '') && <div className="p-1">
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

                          { (linha.codigo != '') && <div className="p-1">
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
                          { (linha.codigo != '') &&  <div className="p-1">
                                <Button onClick={ () => { abrirPopupEditar(linha.id, linha.codigo, linha.atividade, linha.horas, linha.dataInicio, linha.dataConclusao, linha.situacao ) } }  variant="outline-secondary" >
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
                      <td>{linha.codigo}</td>
                      <td><pre>{linha.atividade}</pre></td>      
                      <td>{linha.horas}</td>      
                      <td>{linha.dataInicio ? moment(linha.dataInicio).format('DD/MM/YYYY') : '' }</td>      
                      <td>{linha.dataConclusao ? moment(linha.dataConclusao).format('DD/MM/YYYY') : '' }</td>      
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
    
        <Modal show={showPopupAdicionar} onHide={handleClosePopupAdicionar} backdrop="static" keyboard={false} >
          <Modal.Header closeButton>
            <Modal.Title>Adicionar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
                <Form.Group className="mb-3" controlId="codigo">
                    <Form.Label >Informe o código*</Form.Label>
                    <Form.Control type="text" size="sm" placeholder="Exemplo 01.00.00.00"  value={codigo} onChange={handleCodigo}  />
                </Form.Group>                    
            
                <Form.Group className="mb-3" controlId="atividade">
                    <Form.Label >Informe a Atividade*</Form.Label>
                    <Form.Control type="text" size="sm" placeholder=""  value={atividade} onChange={handleAtividade}  />
                </Form.Group>                
                
                <Form.Group className="mb-3" controlId="horas">
                    <Form.Label >Informe as Horas</Form.Label>
                    <Form.Control type="text" size="sm" placeholder=""  value={horas} onChange={handleHoras} />
                </Form.Group>
            
                <Form.Group className="mb-3" controlId="dataInicio">
                    <Form.Label >Informe a Data de Início</Form.Label>
                    <Form.Control type="date" size="sm" placeholder=""  value={dataInicio} onChange={handleDataInicio} />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="dataConclusao">
                    <Form.Label >Informe a Data de Conclusão</Form.Label>
                    <Form.Control type="date" size="sm"  placeholder=""  value={dataConclusao} onChange={handleDataConclusao} />
                </Form.Group>                
                                                                    
                <Form.Group className="mb-3" controlId="situacao">
                  <Form.Label >Informe a situação da atividade</Form.Label>
                  <Form.Select aria-label="Selecione" size="sm" value={situacao} onChange={handleSituacao} >
                    <option>Selecione</option>                  
                    <option value="1">Aguardando Inicio</option>
                    <option value="2">Em Execusão</option>
                    <option value="3">Paralizada</option>
                    <option value="4">Concluída</option>                            
                  </Form.Select>                      
                </Form.Group>              
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClosePopupAdicionar}>Cancelar</Button>
            <Button variant="primary" onClick={adicionarItem} >Salvar</Button>
          </Modal.Footer>
      </Modal>        


        <Modal show={showPopupEditar} onHide={handleClosePopupEditar} backdrop="static" keyboard={false} >
          <Modal.Header closeButton>
            <Modal.Title>Editar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>

              <Form.Group className="mb-3" controlId="popup.codigo">
                <Form.Label>Código*</Form.Label>
                <Form.Control value={codigoPopup} onChange={handleCodigoPopup} type="text" size="sm" placeholder="" autoFocus />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.atividade">
                <Form.Label>Atividade*</Form.Label>
                <Form.Control value={atividadePopup} onChange={handleAtividadePopup} type="text" size="sm" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.horas">
                <Form.Label>Horas</Form.Label>
                <Form.Control value={horasPopup} type="text" onChange={handleHorasPopup}  size="sm" placeholder=""  defaultValue=""  />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.dataInicio">
                <Form.Label>Data de Início</Form.Label>
                <Form.Control value={dataInicioPopup} type="date" onChange={handleDataInicioPopup} size="sm" placeholder=""  defaultValue=""  />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.dataConclusao">
                <Form.Label>Data de Conclusão</Form.Label>
                <Form.Control value={dataConclusaoPopup} type="date" onChange={handleDataConclusaoPopup} size="sm" placeholder=""  defaultValue=""  />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.atividade">
                <Form.Label>Situação</Form.Label>
                <Form.Select size="sm" value={situacaoPopup} onChange={handleSituacaoPopup} aria-label="Selecione">
                  <option>Selecione</option>                  
                  <option value="1">Aguardando Inicio</option>
                  <option value="2">Em Execusão</option>
                  <option value="3">Paralizada</option>
                  <option value="4">Concluída</option>                            
                </Form.Select>                      
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

      <Modal size="sm" show={exibeCarregando} onHide={() => setExibeCarregando(false)} aria-labelledby="" backdrop="static" keyboard={false} >        
        <Modal.Body>
          <Spinner animation="border" role="status"></Spinner>&nbsp;<span >Por favor aguarde, processando!</span>       
        </Modal.Body>
      </Modal>

      <Modal show={exibirMensagemExclusao} onHide={() => { setExibirMensagemExclusao(false) }} animation={false} backdrop="static" keyboard={false} >
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
      
      <Modal size="sm" show={exibirMensagemAlerta} onHide={() => { setExibirMensagemAlerta(false) }} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" >
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

export default eapView;
