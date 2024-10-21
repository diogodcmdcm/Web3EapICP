import List "mo:base/List";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {

  //estrutura do Projeto
  type Projeto = {
    id : Int;    
    nomeProjeto: Text;
    horasEstimadas: Text;
    dataInicio: Text; //Recebe timestamp
    dataConclusao: Text;
    situacao: Text; //Recebe timestamp    
  };

  //estrutura da EAP
  type ItemEAP = {
    id : Int;
    codigo: Text;
    atividade: Text;
    horas: Text;
    dataInicio: Text;
    dataConclusao: Text;
    situacao: Text;    
  };

  //estrutura da equipe
  type Equipe = {
    id : Int;
    nome: Text;
    cargo: Text;    
  };

  //estrutura da agenda equipe
  type AgendaEquipe = {
    id : Int;
    nome: Text;
    atividade: Text;     
    data: Text;   
    horaInicio: Text;
    horaConclusao: Text;
  };

  var arrayProjeto: [Projeto] = [];
  var identificadorProjeto: Int = 1;

  var mapProjetosEAP : HashMap.HashMap<Text, [ItemEAP]> = HashMap.HashMap<Text, [ItemEAP]>(32, Text.equal, Text.hash);
  var identificadorEAP: Int = 1;

  var mapProjetosEquipe : HashMap.HashMap<Text, [Equipe]> = HashMap.HashMap<Text, [Equipe]>(32, Text.equal, Text.hash);
  var identificadorEquipe: Int = 1;

  var mapProjetosAgendaEquipe : HashMap.HashMap<Text, [AgendaEquipe]> = HashMap.HashMap<Text, [AgendaEquipe]>(32, Text.equal, Text.hash);
  var identificadorAgendaEquipe: Int = 1;

  //############################################ PROJETO ######################################################
  // Método utilizado para adicionar um novo projeto no MAP
  public func cadastrarProjeto(nome: Text, he: Text, dti: Text, dtc: Text, sit: Text) : async () {         

      identificadorProjeto := identificadorProjeto + 1;    
      var novoProjeto : Projeto = {id = identificadorProjeto; nomeProjeto = nome; horasEstimadas = he; dataInicio = dti; dataConclusao = dtc; situacao = sit };
      arrayProjeto := Array.append<Projeto>(arrayProjeto, [novoProjeto]);

      identificadorEAP := identificadorEAP + 1;    
      var novoItem : ItemEAP = {id = identificadorEAP; codigo = ""; atividade = "Clique no botão + para adicionar um item na EAP. É importante o código seguir o padrão 00.00.00.00.00"; horas = ""; dataInicio = ""; dataConclusao = ""; situacao = "" };
      var arrayEAP = [novoItem];
      mapProjetosEAP.put(nome, arrayEAP);

      identificadorEquipe := identificadorEquipe + 1;    
      var equipe : Equipe = {id = identificadorEquipe; nome = "Clique no botão + para adicionar uma nova pessoa da equipe."; cargo = ""; };
        
      var arrayEquipe = [equipe];
      mapProjetosEquipe.put(nome, arrayEquipe);

      identificadorAgendaEquipe := identificadorAgendaEquipe + 1;    
      var agendaEquipe : AgendaEquipe = {id = identificadorAgendaEquipe; nome = "Clique no botão + para adicionar uma nova agenda."; atividade = ""; data= "";  horaInicio= "";  horaConclusao = ""};
      var arrayAgendaEquipe = [agendaEquipe];
      mapProjetosAgendaEquipe.put(nome, arrayAgendaEquipe);

  };

  // Método utilizado para retornar o array completo de projetos
  public query func getArrayProjetos() : async [Projeto] {     
      return arrayProjeto;
  };


  //############################################ EAP ######################################################
  // Método utilizado para adicionar um item no array da EAP
  public func addItemNoArray(idProjeto: Text, cod: Text, ati: Text, hr: Text, di: Text, dc: Text, sit: Text) : async () {  

      var arrayEAP : ?[ItemEAP] = mapProjetosEAP.get(idProjeto);
     
      switch (arrayEAP) {
        case (null) { /* adicionar novo array caso o array do hashmap fosse null */  };
        case (?arrayEAP) {
       
            identificadorEAP := identificadorEAP + 1;                
            var novoItem : ItemEAP = {id = identificadorEAP; codigo = cod; atividade = ati; horas = hr; dataInicio = di; dataConclusao = dc; situacao = sit };            
            let novoArray = Array.append<ItemEAP>(arrayEAP, [novoItem]);  
            mapProjetosEAP.put(idProjeto, novoArray);     

        };
      };      
    
  };

  // Método utilizado para alterar um item da EAP
  public func alterarItemEAP(idProjeto: Text, idAlt: Int, cod: Text, ati: Text, hr: Text, di: Text, dc: Text, sit: Text) : async () {  
    
    var arrayEAP : ?[ItemEAP] = mapProjetosEAP.get(idProjeto);

    switch (arrayEAP) {
        case (null) { /* */  };
        case (?arrayEAP) {
          
          let arrayFilter = Array.filter<ItemEAP>(arrayEAP, func(x) { x.id != idAlt });
          var novoItem : ItemEAP = {id = idAlt; codigo = cod; atividade = ati; horas = hr; dataInicio = di; dataConclusao = dc; situacao = sit };
          let novoArray = Array.append<ItemEAP>(arrayFilter, [novoItem]);  
          mapProjetosEAP.put(idProjeto, novoArray);         

        };
      };      

    
  };
  
  // Método utilizado para excluir um item da EAP
  public func excluirItem(idProjeto: Text, id: Int) : async () {      
    
    var arrayEAP : ?[ItemEAP] = mapProjetosEAP.get(idProjeto);

    switch (arrayEAP) {
        case (null) { /* */  };
        case (?arrayEAP) {          
            let arrayFilter = Array.filter<ItemEAP>(arrayEAP, func(x) { x.id != id });                    
            mapProjetosEAP.put(idProjeto, arrayFilter);         
        };
      };      

  };

  // Método utilizado para retornar o array completo da EAP de um projeto
  public query func getArrayItensEAP(idProjeto: Text) : async ?[ItemEAP] {

    var arrayEAP : ?[ItemEAP] = mapProjetosEAP.get(idProjeto);
     
    return arrayEAP;
  };

    //############################################ EQUIPE ######################################################

    // Método utilizado para adicionar um item no array da equipe
  public func addEquipe(idProjeto: Text, nom: Text, car: Text ) : async () {  

      var arrayEquipe : ?[Equipe] = mapProjetosEquipe.get(idProjeto);
     
      switch (arrayEquipe) {
        case (null) { /* adicionar novo array caso o array do hashmap fosse null */  };
        case (?arrayEquipe) {
       
            identificadorEquipe := identificadorEquipe + 1;                
            var equipe : Equipe = {id = identificadorEquipe; nome = nom; cargo = car; };            
            let novoArray = Array.append<Equipe>(arrayEquipe, [equipe]);  
            mapProjetosEquipe.put(idProjeto, novoArray);     

        };
      };      
    
  };

  // Método utilizado para alterar uma pessoa da equipe
  public func alterarEquipe(idProjeto: Text, idAlt: Int, nom: Text, car: Text ) : async () {  
    
    var arrayEquipe : ?[Equipe] = mapProjetosEquipe.get(idProjeto);

    switch (arrayEquipe) {
        case (null) { /* */  };
        case (?arrayEquipe) {
          
          let arrayFilter = Array.filter<Equipe>(arrayEquipe, func(x) { x.id != idAlt });
          var equipe : Equipe = {id = idAlt; nome = nom; cargo = car; };
          let novoArray = Array.append<Equipe>(arrayFilter, [equipe]);  
          mapProjetosEquipe.put(idProjeto, novoArray);         

        };
      };      
    
  };
  
  // Método utilizado para excluir uma equipe
  public func excluirEquipe(idProjeto: Text, id: Int) : async () {      
    
    var arrayEquipe : ?[Equipe] = mapProjetosEquipe.get(idProjeto);

    switch (arrayEquipe) {
        case (null) { /* */  };
        case (?arrayEquipe) {          
            let arrayFilter = Array.filter<Equipe>(arrayEquipe, func(x) { x.id != id });                    
            mapProjetosEquipe.put(idProjeto, arrayFilter);         
        };
      };      

  };

  // Método utilizado para retornar o array completo da equipe de um projeto
  public query func getArrayEquipe(idProjeto: Text) : async ?[Equipe] {

    var arrayEquipe : ?[Equipe] = mapProjetosEquipe.get(idProjeto);
     
    return arrayEquipe;
  };

  //############################################ AGENDA EQUIPE ######################################################

  // Método utilizado para adicionar um item no array da agenda da equipe
  public func addAgendaEquipe(idProjeto: Text, nom: Text, ativ: Text, dt: Text, hi: Text, hc: Text ) : async () {  

      var arrayAgendaEquipe : ?[AgendaEquipe] = mapProjetosAgendaEquipe.get(idProjeto);
     
      switch (arrayAgendaEquipe) {
        case (null) { /* adicionar novo array caso o array do hashmap fosse null */  };
        case (?arrayAgendaEquipe) {
       
            identificadorAgendaEquipe := identificadorAgendaEquipe + 1;                
            var agendaEquipe : AgendaEquipe = {id = identificadorAgendaEquipe; nome = nom; atividade = ativ; data = dt; horaInicio = hi; horaConclusao = hc};            
            let novoArray = Array.append<AgendaEquipe>(arrayAgendaEquipe, [agendaEquipe]);  
            mapProjetosAgendaEquipe.put(idProjeto, novoArray);     

        };
      };      
    
  };

  // Método utilizado para alterar uma agenda
  public func alterarAgendaEquipe(idProjeto: Text, idAlt: Int, nom: Text, ativ: Text, dt: Text, hi: Text, hc: Text ) : async () {  
    
    var arrayAgendaEquipe : ?[AgendaEquipe] = mapProjetosAgendaEquipe.get(idProjeto);

    switch (arrayAgendaEquipe) {
        case (null) { /* */  };
        case (?arrayAgendaEquipe) {
          
          let arrayFilter = Array.filter<AgendaEquipe>(arrayAgendaEquipe, func(x) { x.id != idAlt });
          var agendaEquipe : AgendaEquipe = {id = idAlt; nome = nom; atividade = ativ; data = dt; horaInicio = hi; horaConclusao = hc };
          let novoArray = Array.append<AgendaEquipe>(arrayFilter, [agendaEquipe]);  
          mapProjetosAgendaEquipe.put(idProjeto, novoArray);         

        };
      };      
    
  };

  // Método utilizado para excluir uma agenda
  public func excluirAgendaEquipe(idProjeto: Text, id: Int) : async () {      
    
    var arrayAgendaEquipe : ?[AgendaEquipe] = mapProjetosAgendaEquipe.get(idProjeto);

    switch (arrayAgendaEquipe) {
        case (null) { /* */  };
        case (?arrayAgendaEquipe) {          
            let arrayFilter = Array.filter<AgendaEquipe>(arrayAgendaEquipe, func(x) { x.id != id });                    
            mapProjetosAgendaEquipe.put(idProjeto, arrayFilter);         
        };
      };      

  };

  // Método utilizado para retornar o array completo das agendas de um projeto
  public query func getArrayAgendaEquipe(idProjeto: Text) : async ?[AgendaEquipe] {

    var arrayAgendaEquipe : ?[AgendaEquipe] = mapProjetosAgendaEquipe.get(idProjeto);
     
    return arrayAgendaEquipe;
  };

};
