import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { web3eap_backend } from 'declarations/web3eap_backend';
import { Table, Button, Form, Stack, Modal, Nav } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function eapView() { 
  
  const { idProjeto } = useParams(); 
  
  function paginaInicial(){
    window.location.href = '/';
  }

  useEffect( async () => {     
    let response = await web3eap_backend.getArrayItensEAP(idProjeto);
    let eapOrdenada = response[0].sort((a,b) => (a.codigo.replace(/\./g, '')) - (b.codigo.replace(/\./g, '')) ); // funcao para ordenar o array 
    setEap(eapOrdenada);    
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

  async function adicionarItem() {        
    
    if(codigo == null || codigo.trim()==''){
      alert("Informe o código");
    } else if(atividade == null || atividade.trim()==''){
      alert("Informe a atividade");
    } else {

      await web3eap_backend.addItemNoArray(idProjeto, codigo, atividade, horas, dataInicio, dataConclusao, situacao);
      let response = await web3eap_backend.getArrayItensEAP(idProjeto);
    
      let eapFormatada = formatarEAP(response[0]); 

      setEap(eapFormatada);
      setShowPopupAdicionar(false);

      setCodigo(''); 
      setAtividade(''); 
      setHoras(''); 
      setDataInicio(''); 
      setDataConclusao(''); 
      setSituacao('');

    }    
        
  } 

  async function excluirItem(idExcluir) { 
      await web3eap_backend.excluirItem(idProjeto, idExcluir);
      let response = await web3eap_backend.getArrayItensEAP(idProjeto);

      let eapFormatada = formatarEAP(response[0]);       
      setEap(eapFormatada);
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

      await web3eap_backend.alterarItemEAP(idProjeto, idItemPopup,codigoPopup, atividadePopup, horasPopup, dataInicioPopup, dataConclusaoPopup, situacaoPopup);
      let response = await web3eap_backend.getArrayItensEAP(idProjeto);

      let eapFormatada = formatarEAP(response[0]);       
      setEap(eapFormatada);
      
      setShowPopupEditar(false);    

      setIdItemPopup('');
      setCodigoPopup(''); 
      setAtividadePopup(''); 
      setHorasPopup(''); 
      setDataInicioPopup(''); 
      setDataConclusaoPopup(''); 
      setSituacaoPopup('');

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
        <div>
            <Stack direction="horizontal" gap={3}>              
              <div className="p-2"> <Button onClick={paginaInicial} variant="outline-primary">Início</Button>{' '}</div>              
              <div className="p-2"> <Button onClick={paginaInicial} variant="outline-primary">Consultar Projetos</Button>{' '}</div>              
              <div className="p-2 ms-auto"><Button variant="outline-primary">Conectar Wallet</Button>{' '}</div>
            </Stack>
            <br/>
            <div>
              <h1>Projeto: {idProjeto}</h1>
            </div>           
        </div>        

      <br/>
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
                                  <Button onClick={ () => { abrirPopupAdicionar() } } >
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
                                  <Button onClick={ () => { excluirItem(linha.id) } } >
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
                                <Button onClick={ () => { abrirPopupEditar(linha.id, linha.codigo, linha.atividade, linha.horas, linha.dataInicio, linha.dataConclusao, linha.situacao ) } } >
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
                      <td>{linha.dataInicio}</td>      
                      <td>{linha.dataConclusao}</td>      
                      <td>
                          { linha.situacao=='1'?'Aguardando Inicio':''}
                          { linha.situacao=='2'?'Em Execusão':''}
                          { linha.situacao=='3'?'Paralizada':''}
                          { linha.situacao=='4'?'Concluída':''}                          
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
                    <Form.Label>Informe o código*</Form.Label>
                    <Form.Control type="text"  placeholder="Exemplo 01.00.00.00"  value={codigo} onChange={handleCodigo}  />
                </Form.Group>                    
            
                <Form.Group className="mb-3" controlId="Informe a Atividade">
                    <Form.Label>Informe a Atividade*</Form.Label>
                    <Form.Control type="text"  placeholder=""  value={atividade} onChange={handleAtividade}  />
                </Form.Group>                
                
                <Form.Group className="mb-3" controlId="horas">
                    <Form.Label>Informe as Horas</Form.Label>
                    <Form.Control type="text"  placeholder=""  value={horas} onChange={handleHoras} />
                </Form.Group>
            
                <Form.Group className="mb-3" controlId="dataInicio">
                    <Form.Label>Informe a Data de Início</Form.Label>
                    <Form.Control type="date"  placeholder=""  value={dataInicio} onChange={handleDataInicio} />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="dataConclusao">
                    <Form.Label>Informe a Data de Conclusão</Form.Label>
                    <Form.Control type="date"  placeholder=""  value={dataConclusao} onChange={handleDataConclusao} />
                </Form.Group>                
                                                                    
                <Form.Group className="mb-3" controlId="situacao">
                  <Form.Label>Informe a situação da atividade</Form.Label>
                  <Form.Select aria-label="Selecione" value={situacao} onChange={handleSituacao} >
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
            <Button variant="primary" onClick={adicionarItem} >Salvar Alterações</Button>
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
                <Form.Control value={codigoPopup} onChange={handleCodigoPopup} type="text" placeholder="" autoFocus />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.atividade">
                <Form.Label>Atividade*</Form.Label>
                <Form.Control value={atividadePopup} onChange={handleAtividadePopup} type="text" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.horas">
                <Form.Label>Horas</Form.Label>
                <Form.Control value={horasPopup} type="text" onChange={handleHorasPopup}  placeholder=""  defaultValue=""  />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.dataInicio">
                <Form.Label>Data de Início</Form.Label>
                <Form.Control value={dataInicioPopup} type="date" onChange={handleDataInicioPopup} placeholder=""  defaultValue=""  />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.dataConclusao">
                <Form.Label>Data de Conclusão</Form.Label>
                <Form.Control value={dataConclusaoPopup} type="date" onChange={handleDataConclusaoPopup} placeholder=""  defaultValue=""  />
              </Form.Group>
              <Form.Group className="mb-3" controlId="popup.atividade">
                <Form.Label>Situação</Form.Label>
                <Form.Select value={situacaoPopup} onChange={handleSituacaoPopup} aria-label="Selecione">
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
      
      </section>
    </div>
  );
}

export default eapView;
