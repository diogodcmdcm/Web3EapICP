WEB3EAP: Protótipo de um sistema de controle de EAP (Estrutura Analítica do Projeto) de projetos voltados a execusão de serviços onde, a unidade de controle são horas executadas. O protótipo foi desenvolvido utilizando a linguagem MOTOKO e REACT e poderá ser executado na blockchain da ICP.

Neste sistema será possivel cadastrar seus projetos e em seguida incluir a EAP de cada um deles. Na EAP será possivel definir a data inicial e de conclusão de cada atividade, a quantidade de horas que serão utilizadas cada uma delas assim como a situação das atividades. 

Dependências:

    Para rodar o projeto é necessário instalar as seguintes dependências:

        npm install react-bootstrap bootstrap
        npm install react-router-dom

Para executar o projeto utilizar o comando dfx deploy ou dfx deploy --playground

O protótipo ainda exige muitas melhorias e devido a isso é necessário se atentar a estrutura de códigos que será utilizada na EAP, abaixo segue um exemplo de estrutura aderente a situação atual:


    
   | Código       | Atividade         |         
   |--------------|-------------------|   
   | 01.00.00.00  | Grupo 1           |
   | 01.01.00.00  | SubGrupo 1        |
   | 01.01.01.00  | SubGrupo 1.2      |
   | 01.01.01.01  | Atividade 1.1     |
   | 02.00.00.00  | Grupo 2           |
   | 02.01.00.00  | SubGrupo 2        |
   | 02.01.01.00  | Atividade 2.1     |
   | 03.00.00.00  | Grupo 3           |
   | 03.01.00.00  | Atividade 3.1     |
   