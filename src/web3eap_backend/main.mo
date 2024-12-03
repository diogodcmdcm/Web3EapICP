import Array "mo:base/Array";
import TrieMap "mo:base/TrieMap";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Buffer "mo:base/Buffer";
import Iter "mo:base/Iter";
import Hash "mo:base/Hash";
import Principal "mo:base/Principal";

actor {

  //usuarios - falta implementar, a ideia é permitir que vários usuários compatilhem o mesmo projeto e trabalham colaborando
  type Usuario = {
    id: Nat;
    empresa: Text;
    login: Text;
    senha: Text;   
    ativo: Bool; 
  };

  //estrutura do Projeto
  type Projeto = {    
    owner: Text; //O correto é owner: Principal; porem estamos com problema em obter o principal do frontend.
    empresa: Text;
    id: Nat;    
    nomeProjeto: Text;
    horasEstimadas: Text;
    dataInicio: Text; //Recebe timestamp
    dataConclusao: Text;
    situacao: Text; //Recebe timestamp    
    usuarios : [Usuario]
  };

  //estrutura da EAP
  type ItemEAP = {
    id: Nat;
    codigo: Text;
    atividade: Text;
    horas: Text;
    dataInicio: Text;
    dataConclusao: Text;
    situacao: Text;    
  };

  //estrutura da equipe
  type Equipe = {
    id: Nat;
    nome: Text;
    cargo: Text;    
  };

  //estrutura da agenda equipe
  type AgendaEquipe = {
    id : Nat;
    nome: Text;
    atividade: Text;     
    data: Text;   
    horaInicio: Text;
    horaConclusao: Text;
  };

  var arrayProjeto = Buffer.Buffer<Projeto>(1);
  stable var identificadorProjeto: Nat = 1;

  var mapProjetosEAP : TrieMap.TrieMap<Nat, [ItemEAP]> = TrieMap.TrieMap<Nat, [ItemEAP]>(Nat.equal, Hash.hash);
  stable var identificadorEAP: Nat = 1;

  var mapProjetosEquipe : TrieMap.TrieMap<Nat, [Equipe]> = TrieMap.TrieMap<Nat, [Equipe]>(Nat.equal, Hash.hash);
  stable var identificadorEquipe: Nat = 1;

  var mapProjetosAgendaEquipe : TrieMap.TrieMap<Nat, [AgendaEquipe]> = TrieMap.TrieMap<Nat, [AgendaEquipe]>(Nat.equal, Hash.hash);
  stable  var identificadorAgendaEquipe: Nat = 1;

  //stable var bufferA = Buffer.Buffer<Int>(3); 

  //############################################ PROJETO ######################################################
  // Método utilizado para adicionar um novo projeto no MAP
  public shared(msg) func cadastrarProjeto(nome: Text, he: Text, dti: Text, dtc: Text, sit: Text) : async () {         

      let principal = Principal.toText(msg.caller);

      identificadorProjeto := identificadorProjeto + 1;    
      //O correto é owner = msg.caller porem não está vindo corretamente o principal do logado, está sendo chegando anonimo, isso deverá ser corrigido para ter maior segurança
      var novoProjeto : Projeto = {owner = principal; empresa = ""; id = identificadorProjeto; nomeProjeto = nome; horasEstimadas = he; dataInicio = dti; dataConclusao = dtc; situacao = sit; usuarios = [] };
      //arrayProjeto := Array.append<Projeto>(arrayProjeto, [novoProjeto]);
      arrayProjeto.add(novoProjeto);

      identificadorEAP := identificadorEAP + 1;    
      var novoItem : ItemEAP = {id = identificadorEAP; codigo = ""; atividade = "Clique no botão + para adicionar um item na EAP. É importante o código seguir o padrão 00.00.00.00.00"; horas = ""; dataInicio = ""; dataConclusao = ""; situacao = "" };
      var arrayEAP = [novoItem];
      mapProjetosEAP.put(identificadorProjeto, arrayEAP);

      identificadorEquipe := identificadorEquipe + 1;    
      var equipe : Equipe = {id = identificadorEquipe; nome = "Clique no botão + para adicionar uma nova pessoa da equipe."; cargo = ""; };
        
      var arrayEquipe = [equipe];
      mapProjetosEquipe.put(identificadorProjeto, arrayEquipe);

      identificadorAgendaEquipe := identificadorAgendaEquipe + 1;    
      var agendaEquipe : AgendaEquipe = {id = identificadorAgendaEquipe; nome = "Clique no botão + para adicionar uma nova agenda."; atividade = ""; data= "";  horaInicio= "";  horaConclusao = ""};
      var arrayAgendaEquipe = [agendaEquipe];
      mapProjetosAgendaEquipe.put(identificadorProjeto, arrayAgendaEquipe);

  };

  public shared(msg) func alterarProjeto(idProjeto: Nat, nome: Text, he: Text, dti: Text, dtc: Text, sit: Text) : async () {         

      let principal = Principal.toText(msg.caller);
      var tempProj : Projeto = {owner = principal; empresa = ""; id = idProjeto; nomeProjeto = nome; horasEstimadas = he; dataInicio = dti; dataConclusao = dtc; situacao = sit; usuarios = [] };
      
      func localizador(a: Projeto, b: Projeto) : Bool {
        if( a.owner == b.owner and a.id == b.id){
          return true;
        } else {
          return false;
        }
      };

      let index : ?Nat = Buffer.indexOf<Projeto>(tempProj, arrayProjeto, localizador);   

      switch (index) {
        case (null) {
          // O elemento não foi encontrado          
        };
        case (?i) {
          // O elemento foi encontrado, atualize-o
          arrayProjeto.put(i, tempProj);          
        };      
      }
  };

  private func valida_owner_projeto(idProjeto: Nat, principal: Text) : Bool {

      var resultado : Bool = false; 

      var tempProj : Projeto = {owner = principal; empresa = ""; id = idProjeto; nomeProjeto = ""; horasEstimadas = ""; dataInicio = ""; dataConclusao = ""; situacao = ""; usuarios = [] };

      func localizador(a: Projeto, b: Projeto) : Bool {
        if( a.owner == b.owner and a.id == b.id){
          return true;
        } else {
          return false;
        }
      };

      let index : ?Nat = Buffer.indexOf<Projeto>(tempProj, arrayProjeto, localizador);   

      switch (index) {
        case (null) {
          resultado := false;
        };
        case (?i) {
          resultado := true;
        };      
      };

      return resultado;
  };

  public shared(msg) func excluirProjeto(idProjeto: Nat ) : async [Projeto] {     

      let princ = Principal.toText(msg.caller);

      func localizaProjeto(index : Nat, proj: Projeto) : Bool{
        if (proj.id == idProjeto and proj.owner == princ) {
            return false;
        } else if (proj.owner == princ) {
          return true;
        } else {
          return false;
        }
      };
      arrayProjeto.filterEntries(localizaProjeto);
      return Buffer.toArray(arrayProjeto);
  };

  // Método utilizado para retornar o array completo de projetos
  public shared(msg) func getArrayProjetos() : async [Projeto] {     
    

    let principal = Principal.toText(msg.caller);

    //if ( Principal.isAnonymous(msg.caller) == false ){
      
      func validaOwner(proj: Projeto) : Bool {
          //Principal.equal(msg.caller,proj.owner); // Este é o correto porém está sendo sempre com principal anonimo
          principal == proj.owner;
      };

      let arrayResult = Buffer.toArray(arrayProjeto);

      return Array.filter(arrayResult, validaOwner);
            
    //} else {
    //  return [];
    //}
    
    //return arrayResult;
    
  };


  //############################################ EAP ######################################################
  // Método utilizado para adicionar um item no array da EAP
  public func addItemNoArray(idProjeto: Nat, cod: Text, ati: Text, hr: Text, di: Text, dc: Text, sit: Text) : async () {  

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
  public func alterarItemEAP(idProjeto: Nat, idAlt: Nat, cod: Text, ati: Text, hr: Text, di: Text, dc: Text, sit: Text) : async () {  
    
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
  public func excluirItem(idProjeto: Nat, id: Int) : async () {      
    
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
  public query (msg) func getArrayItensEAP(idProjeto: Nat) : async ?[ItemEAP] {

    let owner = valida_owner_projeto(idProjeto, Principal.toText(msg.caller));

    if(owner){
      return mapProjetosEAP.get(idProjeto);
    } else {
      return null;
    }

  };

    //############################################ EQUIPE ######################################################

    // Método utilizado para adicionar um item no array da equipe
  public func addEquipe(idProjeto: Nat, nom: Text, car: Text ) : async () {  

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
  public func alterarEquipe(idProjeto: Nat, idAlt: Nat, nom: Text, car: Text ) : async () {  
    
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
  public func excluirEquipe(idProjeto: Nat, id: Int) : async () {      
    
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
  public query (msg) func getArrayEquipe(idProjeto: Nat) : async ?[Equipe] {

    let owner = valida_owner_projeto(idProjeto, Principal.toText(msg.caller));

    if(owner){
      return mapProjetosEquipe.get(idProjeto);
    } else {
      return null;
    }

  };

  //############################################ AGENDA EQUIPE ######################################################

  // Método utilizado para adicionar um item no array da agenda da equipe
  public func addAgendaEquipe(idProjeto: Nat, nom: Text, ativ: Text, dt: Text, hi: Text, hc: Text ) : async () {  

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
  public func alterarAgendaEquipe(idProjeto: Nat, idAlt: Nat, nom: Text, ativ: Text, dt: Text, hi: Text, hc: Text ) : async () {  
    
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
  public func excluirAgendaEquipe(idProjeto: Nat, id: Int) : async () {      
    
    var arrayAgendaEquipe : ?[AgendaEquipe] = mapProjetosAgendaEquipe.get(idProjeto);

    switch (arrayAgendaEquipe) {
        case (null) { /* */  };
        case (?arrayAgendaEquipe) {          
            let arrayFilter = Array.filter<AgendaEquipe>(arrayAgendaEquipe, func(x) { x.id != id });                    
            mapProjetosAgendaEquipe.put(idProjeto, arrayFilter);         
        };
      };      

  };

  
  public query (msg) func getArrayAgendaEquipe(idProjeto: Nat) : async ?[AgendaEquipe] {  

    let owner = valida_owner_projeto(idProjeto, Principal.toText(msg.caller));

    if(owner){
      return mapProjetosAgendaEquipe.get(idProjeto);
    } else {
      return null;
    }

  };

  // Método utilizado para retornar o array completo das agendas de um projeto
  stable var stableArrayProjeto : [(Projeto)] = [];  
  stable var stableMapProjetosEAP : [(Nat, [ItemEAP])] = [];  
  stable var stableMapProjetosEquipe : [(Nat, [Equipe])] = [];  
  stable var stableMapProjetosAgendaEquipe : [(Nat, [AgendaEquipe])] = [];  

  system func preupgrade() {
    stableArrayProjeto := Buffer.toArray(arrayProjeto);
    stableMapProjetosEAP := Iter.toArray(mapProjetosEAP.entries());
    stableMapProjetosEquipe := Iter.toArray(mapProjetosEquipe.entries());
    stableMapProjetosAgendaEquipe := Iter.toArray(mapProjetosAgendaEquipe.entries());
  };

  system func postupgrade() {
      arrayProjeto := Buffer.fromArray(stableArrayProjeto);
      stableArrayProjeto := [];

      mapProjetosEAP := TrieMap.fromEntries(stableMapProjetosEAP.vals(), Nat.equal, Hash.hash);
      stableMapProjetosEAP := [];

      mapProjetosEquipe := TrieMap.fromEntries(stableMapProjetosEquipe.vals(), Nat.equal, Hash.hash);
      stableMapProjetosEquipe := [];

      mapProjetosAgendaEquipe := TrieMap.fromEntries(stableMapProjetosAgendaEquipe.vals(), Nat.equal, Hash.hash);
      stableMapProjetosAgendaEquipe := [];
  };


};
