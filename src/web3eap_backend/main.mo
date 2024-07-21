import List "mo:base/List";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {

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
    
  var mapProjetos : HashMap.HashMap<Text, [ItemEAP]> = HashMap.HashMap<Text, [ItemEAP]>(32, Text.equal, Text.hash);
  var identificador: Int = 1;

  // Método utilizado para adicionar um novo projeto no MAP
  public func cadastrarProjeto(nome: Text) : async () {      

      identificador := identificador + 1;    
      var novoItem : ItemEAP = {id = identificador; codigo = ""; atividade = "Clique no botão + para adicionar um item na EAP. É importante o código seguir o padrão 00.00.00.00.00"; horas = ""; dataInicio = ""; dataConclusao = ""; situacao = "" };
      var arrayEAP = [novoItem];
      mapProjetos.put(nome, arrayEAP);

  };

  // Método utilizado para retornar o array completo de projetos
  public query func getArrayProjetos() : async [Text] {

    var nomesProjetos: [Text] = [];

    for (key in mapProjetos.keys()) {  
      nomesProjetos := Array.append<Text>(nomesProjetos, [key] );       
    };  

    return nomesProjetos;
  };


  // Método utilizado para adicionar um item no array da EAP
  public func addItemNoArray(idProjeto: Text, cod: Text, ati: Text, hr: Text, di: Text, dc: Text, sit: Text) : async () {  

      var arrayEAP : ?[ItemEAP] = mapProjetos.get(idProjeto);
     
      switch (arrayEAP) {
        case (null) { /* adicionar novo array caso o array do hashmap fosse null */  };
        case (?arrayEAP) {
       
            identificador := identificador + 1;                
            var novoItem : ItemEAP = {id = identificador; codigo = cod; atividade = ati; horas = hr; dataInicio = di; dataConclusao = dc; situacao = sit };            
            let novoArray = Array.append<ItemEAP>(arrayEAP, [novoItem]);  
            mapProjetos.put(idProjeto, novoArray);     

        };
      };      
    
  };

  // Método utilizado para alterar um item da EAP
  public func alterarItemEAP(idProjeto: Text, idAlt: Int, cod: Text, ati: Text, hr: Text, di: Text, dc: Text, sit: Text) : async () {  
    
    var arrayEAP : ?[ItemEAP] = mapProjetos.get(idProjeto);

    switch (arrayEAP) {
        case (null) { /* */  };
        case (?arrayEAP) {
          
          let arrayFilter = Array.filter<ItemEAP>(arrayEAP, func(x) { x.id != idAlt });
          var novoItem : ItemEAP = {id = idAlt; codigo = cod; atividade = ati; horas = hr; dataInicio = di; dataConclusao = dc; situacao = sit };
          let novoArray = Array.append<ItemEAP>(arrayFilter, [novoItem]);  
          mapProjetos.put(idProjeto, novoArray);         

        };
      };      

    
  };
  
  // Método utilizado para excluir um item da EAP
  public func excluirItem(idProjeto: Text, id: Int) : async () {      
    
    var arrayEAP : ?[ItemEAP] = mapProjetos.get(idProjeto);

    switch (arrayEAP) {
        case (null) { /* */  };
        case (?arrayEAP) {          
            let arrayFilter = Array.filter<ItemEAP>(arrayEAP, func(x) { x.id != id });                    
            mapProjetos.put(idProjeto, arrayFilter);         
        };
      };      

  };

  // Método utilizado para retornar o array completo da EAP de um projeto
  public query func getArrayItensEAP(idProjeto: Text) : async ?[ItemEAP] {

    var arrayEAP : ?[ItemEAP] = mapProjetos.get(idProjeto);
     
    return arrayEAP;
  };

};
