import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { web3eap_backend } from 'declarations/web3eap_backend';
import { Table, Button, Form, Stack, Modal, Navbar, Nav, Badge, Card, Container, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import moment from 'moment';

function eapView() { 
  
  const { idProjeto } = useParams(); 
  
  function paginaInicial(){
    window.location.href = '/';
  }

  function paginaEAP(){
    window.location.href = '/eapLink/'+idProjeto;     
  }

  function paginaEquipe(){
    window.location.href = '/equipeLink/'+idProjeto;     
  }

  function paginaAgenda(){
    window.location.href = '/agendaLink/'+idProjeto;     
  }  

  function paginaCalendarioProjeto(){
    window.location.href = '/calendarioProjetoLink/'+idProjeto;     
  }
  
  function paginaCalendarioEquipe(){
    window.location.href = '/calendarioEquipeLink/'+idProjeto;     
  }  

  useEffect( async () => {     
    setExibeCarregando(true);
    let response = await web3eap_backend.getArrayItensEAP(idProjeto);
    let eapOrdenada = response[0].sort((a,b) => (a.codigo.replace(/\./g, '')) - (b.codigo.replace(/\./g, '')) ); // funcao para ordenar o array 
    setEap(eapOrdenada);   
    setExibeCarregando(false); 
  }, []);  
  
  const [showPopupAdicionar, setShowPopupAdicionar] = useState(false);  
  const [showPopupEditar, setShowPopupEditar] = useState(false);  
  
  const [eap, setEap] = useState([]);
              
  const [codigo, setCodigo] = useState('');
  const [atividade, setAtividade] = useState('');
  const [horas, setHoras] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataConclusao, setDataConclusao] = useState('');
  const [situacao, setSituacao] = useState('');

  const [idItemPopup, setIdItemPopup] = useState('');
  const [codigoPopup, setCodigoPopup] = useState('');
  const [atividadePopup, setAtividadePopup] = useState('');
  const [horasPopup, setHorasPopup] = useState('');
  const [dataInicioPopup, setDataInicioPopup] = useState('');
  const [dataConclusaoPopup, setDataConclusaoPopup] = useState('');
  const [situacaoPopup, setSituacaoPopup] = useState('');

  const [exibeCarregando, setExibeCarregando] = useState(false);
  const [exibirMensagemExclusao, setExibirMensagemExclusao] = useState(false);  
  const [idExcluir, setIdExcluir] = useState(null);  

  async function adicionarItem() {        
    
    if(codigo == null || codigo.trim()==''){
      alert("Informe o código");
    } else if(atividade == null || atividade.trim()==''){
      alert("Informe a atividade");
    } else {

      setExibeCarregando(true);
      setShowPopupAdicionar(false);
      await web3eap_backend.addItemNoArray(idProjeto, codigo, atividade, horas, dataInicio, dataConclusao, situacao);
      let response = await web3eap_backend.getArrayItensEAP(idProjeto);
    
      let eapFormatada = formatarEAP(response[0]); 

      setEap(eapFormatada);      

      setCodigo(''); 
      setAtividade(''); 
      setHoras(''); 
      setDataInicio(''); 
      setDataConclusao(''); 
      setSituacao('');
      setExibeCarregando(false);

    }    
        
  } 

  async function excluirItem() { 
      
      setExibeCarregando(true);

      await web3eap_backend.excluirItem(idProjeto, idExcluir);
      let response = await web3eap_backend.getArrayItensEAP(idProjeto);
      setIdExcluir(null);
      let eapFormatada = formatarEAP(response[0]);       
      setEap(eapFormatada);

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

  async function salvarAlteracao() {        

    if(codigoPopup == null || codigoPopup.trim()==''){
      alert("Informe o código");
    } else if(atividadePopup == null || atividadePopup.trim()==''){
      alert("Informe a atividade");
    } else {     

      setShowPopupEditar(false);    
      setExibeCarregando(true);
      await web3eap_backend.alterarItemEAP(idProjeto, idItemPopup,codigoPopup, atividadePopup, horasPopup, dataInicioPopup, dataConclusaoPopup, situacaoPopup);
      let response = await web3eap_backend.getArrayItensEAP(idProjeto);

      let eapFormatada = formatarEAP(response[0]);       
      setEap(eapFormatada);    

      setIdItemPopup('');
      setCodigoPopup(''); 
      setAtividadePopup(''); 
      setHorasPopup(''); 
      setDataInicioPopup(''); 
      setDataConclusaoPopup(''); 
      setSituacaoPopup('');
      setExibeCarregando(false);

    }

  }        

  function formatarEAP(eapForm){    

    let eapOrdenada = eapForm.sort((a,b) => (a.codigo.replace(/\./g, '')) - (b.codigo.replace(/\./g, '')) ); // funcao para ordenar o array 

      for(let i = 0 ; i < eapOrdenada.length ; i++){
        eapOrdenada[i].atividade = formatarAtividade(eapOrdenada[i].codigo, eapOrdenada[i].atividade);
      }

      return eapOrdenada
  }
  
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

  // EAP
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
              <Button variant="light">Sair</Button>
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
    
        <Modal show={showPopupAdicionar} onHide={handleClosePopupAdicionar}>
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


        <Modal show={showPopupEditar} onHide={handleClosePopupEditar}>
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

      <Modal size="sm" show={exibeCarregando} onHide={() => setExibeCarregando(false)} aria-labelledby="" >        
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

export default eapView;
