import React, { useEffect, useState } from 'react';
import { createActor, web3eap_backend } from 'declarations/web3eap_backend';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent} from "@dfinity/agent";
import { Modal, Spinner, Card, Button } from 'react-bootstrap';

let actorLoginBackend = web3eap_backend;

function login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function redirecionaPaginaInicial(){
    window.location.href = '/projectLink/';   
  }

  useEffect(() => {

    // função utilizada para verificar se o usuário está autenticado na rede da ICP 
    async function initAuth() {
      const authClient = await AuthClient.create();

      // Verifica se já há uma sessão autenticada
      const authenticated = await authClient.isAuthenticated();
      if (authenticated) {
        const identity = authClient.getIdentity();                
        setIsAuthenticated(true);
        redirecionaPaginaInicial();  
      } 
        //else {
        // caso o usuário não estiver autenticado na rede da ICP
        //handleLogin();
      //}

    }

    initAuth();
  }, []);

  async function handleLogin(){
        const authClient = await AuthClient.create();
    
      // Redireciona para o provedor de identidade da ICP (Internet Identity)
      authClient.login({
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: async () => {
          const identity = authClient.getIdentity();          

          /* A identidade do usuário autenticado poderá ser utilizada para criar um HttpAgent.
          Ele será posteriormente utilizado para criar o Actor (autenticado) correspondente ao Canister de Backend  */
          const agent = new HttpAgent({identity});
          /* O comando abaixo irá criar um Actor Actor (autenticado) correspondente ao Canister de Backend  
            desta forma, todas as chamadas realizadas a metodos SHARED no Backend irão receber o "Principal" do usuário */
          actorLoginBackend = createActor(process.env.CANISTER_ID_WEB3EAP_BACKEND, {  
              agent,
          });

          setIsAuthenticated(true);
          redirecionaPaginaInicial();

        },

        windowOpenerFeatures: `
                                left=${window.screen.width / 2 - 525 / 2},
                                top=${window.screen.height / 2 - 705 / 2},
                                toolbar=0,location=0,menubar=0,width=525,height=705
                              `,

      });
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>                 
          <Modal centered size="sm" show={true} aria-labelledby="example-modal-sizes-title-sm" >        
            <Modal.Body>
              <Spinner animation="border" role="status"></Spinner>&nbsp;<span >Por favor aguarde, processando!</span>       
            </Modal.Body>
          </Modal>
        </div>
      ) : (        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <Card className="text-center" style={{ width: '650px' }} >
              <Card.Header>Web3Eap (versão Beta)</Card.Header>
              <Card.Body>
                <Card.Title>Controle de Projetos</Card.Title>
                <Card.Text>
                    Para acessar, clique no botão abaixo e autentique-se usando sua Internet Identity.
                </Card.Text>
                <Button onClick={handleLogin} variant="primary">Acessar</Button>
              </Card.Body>          
            </Card>       
         </div>
      )}
    </div>
  );
}

export default login;
