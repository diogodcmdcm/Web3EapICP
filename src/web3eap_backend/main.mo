import List "mo:base/List";
import Array "mo:base/Array";

import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {

  type ItemEAP = {
    id : Int;
    codigo: Text;
    atividade: Text;
    horas: Text;
    dataInicio: Text;
    dataConclusao: Text;
    situacao: Text;    
  };

// Definindo o tipo do MAP
/*
type key = Text;
type value = [ItemEAP];

let projetosMap: HashMap.HashMap<key, value> = HashMap.HashMap<key, value>();
*/

// Definindo tipos de chave e valor
    
  
  //type NomeProjeto = Text;
  //type EAP = [ItemEAP];
  
  //type Projetos = HashMap.HashMap<NomeProjeto, EAP>;
  //let mapProjetos : Projetos = HashMap.HashMap(32, Text.equal, Text.hash);
  var mapProjetos : HashMap.HashMap<Text, [ItemEAP]> = HashMap.HashMap<Text, [ItemEAP]>(32, Text.equal, Text.hash);

  var arrayItem: [ItemEAP] = [];
  var identificador: Int = 1;

  // Método para adicionar um novo projeto no MAP
  public func cadastrarProjeto(nome: Text) : async () {      

      identificador := identificador + 1;    
      var newItem : ItemEAP = {id = identificador; codigo = ""; atividade = "Clique no botão + para adicionar um item na EAP. É importante o código seguir o padrão 00.00.00.00.00"; horas = ""; dataInicio = ""; dataConclusao = ""; situacao = "" };

      var arrayEAP = [newItem];
      mapProjetos.put(nome, arrayEAP);

  };

  // Método para retornar o array completo de projetos
  public query func getArrayProjetos() : async [Text] {

    var nomesProjetos: [Text] = [];
    var teste: Text = "";
    for (key in mapProjetos.keys()) {  
      nomesProjetos := Array.append<Text>(nomesProjetos, [key] );       
    };  

    return nomesProjetos;
    //return teste;
  };


  // Método para adicionar um item no array da EAP
  public func addItemNoArray(idProjeto: Text, cod: Text, ati: Text, hr: Text, di: Text, dc: Text, sit: Text) : async () {  

      var arrayEAP : ?[ItemEAP] = mapProjetos.get(idProjeto);
     
      switch (arrayEAP) {
        case (null) { /* adicionar novo array caso o array do hashmap fosse null */  };
        case (?arrayEAP) {
       //   let firstItem : ItemEAP = arrayEAP[0]; 

            identificador := identificador + 1;                
            var newItem : ItemEAP = {id = identificador; codigo = cod; atividade = ati; horas = hr; dataInicio = di; dataConclusao = dc; situacao = sit };

            //arrayItem := Array.append<ItemEAP>(arrayItem, [newItem]);       
            //arrayEAP := Array.append<EAP>(arrayEAP, [newItem]);       
            
            let novoArray = Array.append<ItemEAP>(arrayEAP, [newItem]);  

            mapProjetos.put(idProjeto, novoArray);     

        };
      };      

      //arrayEAP := Array.append<ItemEAP>(arrayEAP, [cod]);       
    
  };

  // Método para alterar um item da EAP
  public func alterarItemEAP(idProjeto: Text, idAlt: Int, cod: Text, ati: Text, hr: Text, di: Text, dc: Text, sit: Text) : async () {  
    
    /*
    arrayItem := Array.filter<ItemEAP>(arrayItem, func(x) { x.id != idAlt });

    let newItem = {id = idAlt; codigo = cod; atividade = ati; horas = hr; dataInicio = di; dataConclusao = dc; situacao = sit };
    arrayItem := Array.append<ItemEAP>(arrayItem, [newItem ]);       
  */

    var arrayEAP : ?[ItemEAP] = mapProjetos.get(idProjeto);

    switch (arrayEAP) {
        case (null) { /* */  };
        case (?arrayEAP) {
          
          let arrayFilter = Array.filter<ItemEAP>(arrayEAP, func(x) { x.id != idAlt });

          var newItem : ItemEAP = {id = idAlt; codigo = cod; atividade = ati; horas = hr; dataInicio = di; dataConclusao = dc; situacao = sit };

          let novoArray = Array.append<ItemEAP>(arrayFilter, [newItem]);  
          mapProjetos.put(idProjeto, novoArray);         

        };
      };      

    
  };
  
  public func excluirItem(idProjeto: Text, id: Int) : async () {      
    
    //arrayItem := Array.filter<ItemEAP>(arrayItem, func(x) { x.id != id });

    var arrayEAP : ?[ItemEAP] = mapProjetos.get(idProjeto);

    switch (arrayEAP) {
        case (null) { /* */  };
        case (?arrayEAP) {          
            let arrayFilter = Array.filter<ItemEAP>(arrayEAP, func(x) { x.id != id });                    
            mapProjetos.put(idProjeto, arrayFilter);         
        };
      };      

  };

    // Método para retornar o array completo de pessoas
  public query func getArrayItensEAP(idProjeto: Text) : async ?[ItemEAP] {

    var arrayEAP : ?[ItemEAP] = mapProjetos.get(idProjeto);
     
    return arrayEAP;
  };

};
