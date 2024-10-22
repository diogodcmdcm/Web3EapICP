import React, { useEffect, useState } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Modal, Spinner } from 'react-bootstrap';


function login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identidade, setIdentidade] = useState(null);

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
        setIdentidade(identity.getPrincipal().toText());
        setIsAuthenticated(true);
        redirecionaPaginaInicial();  
      } else {
        // caso o usuário não estiver autenticado na rede da ICP
        handleLogin();
      }

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
        setIdentidade(identity.getPrincipal().toText());
        setIsAuthenticated(true);
        redirecionaPaginaInicial();
      },
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
        <Modal centered size="sm" show={true} aria-labelledby="example-modal-sizes-title-sm" >        
        <Modal.Body>
          <Spinner animation="border" role="status"></Spinner>&nbsp;&nbsp;&nbsp;<span >Direcionando para autenticação na rede da ICP!</span>       
        </Modal.Body>
      </Modal>       
      )}
    </div>
  );
}

export default login;
