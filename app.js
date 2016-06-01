
	var app = angular.module('Trabformais',[]);
	
	app.controller('FormaisController', function(){
			
			

		//Gramatica Exemplo 1
		/*this.terminais = 'a,b,&';
		this.naoTerminais = 'A,B,S';		
		this.simboloProducao = 'P';
		this.simboloInicioProducao = 'S';
		this.conjuntoProducoes = 'S->AB|A|B\nA->a|Aa|&\nB->b|Bb';;
        */

        //Gramatica Exemplo 2
        /*
        this.terminais = '+,*,i,(,)';
        this.naoTerminais = 'E,T,X,Y';
        this.simboloProducao = 'P';
        this.simboloInicioProducao = 'E';
        this.conjuntoProducoes = 'E->TX\nT->(E)|iY|XY\nX->+E|&\nY->*T|&';
        */
        //Gramatica Exemplo 3
        /*this.terminais = 't';
        this.naoTerminais = 'A,B';
        this.simboloProducao = 'P';
        this.simboloInicioProducao = 'A';
        this.conjuntoProducoes = 'A->tB|Bt\nB->tA|At';
*/

        // Gramatica Exemplo 4
        this.terminais = '+,*,i,(,)';
        this.naoTerminais = 'E,T,X,Y';
        this.simboloProducao = 'P';
        this.simboloInicioProducao = 'E';
        this.conjuntoProducoes = 'E->TX\nT->(E)|iY\nX->+E|&\nY->*T|&';


        // Gramatica Exemplo 5
        /*this.terminais = 'i,p,n,(,+,;,=';
        this.naoTerminais = 'P,C,E';
        this.simboloProducao = 'P';
        this.simboloInicioProducao = 'P';
        this.conjuntoProducoes = 'P->c;p|&\nC->i=E|pE\nE->i|n|(E+E)';*/
        /*PROG -> CMD ; PROG
        PROG ->
        CMD -> id = EXP
        CMD -> print EXP
        EXP -> id
        EXP -> num
        EXP -> ( EXP + EXP )
        */


        this.processado = false;
        this.sentencaProcessada = false;

        this.sentenca = 'i*i';

        this.listaTerminais = [];
		this.listaNaoTerminais = [];

        this.pilha = [];
		
		this.producoes = [];
		
		this.listaFirstDeNaoTerminal = [];
		this.listaFollowDeNaoTerminal = [];

        //estrutura auxiliar para ser usada no follow com objetivo de evitar recursividade
        this.chamadasFollow = [];
	
		var formaisController = this;
		
		this.caractereSentencaVazia = '&';
        this.caractereFimProducao = '$';

        this.tabelaPreditiva = [];
		
		this.gerarSentencas = function(){
			this.listaTerminais = [];
			this.producoes = [];
			this.listaFirstDeNaoTerminal = [];
			this.listaFollowDeNaoTerminal = [];
			this.listaNaoTerminais = [];
            this.chamadasFollow = [];
			
			this.listaTerminais = this.terminais.split(",");			
			this.listaNaoTerminais = this.naoTerminais.split(",");
			
			this.listaLadoEsquerdoConjuntoProducao = [];
			
			
			this.gerarListaConjuntoProducoes();

		};
		
		this.gerarListaConjuntoProducoes = function(){
		
			// Separacao das linhas das producoes
			var listaDeLinhasDasProducoes = this.separarLinhasDasProducoes();
			console.log(listaDeLinhasDasProducoes);			
			
			for (i = 0; i < listaDeLinhasDasProducoes.length; i++) {
				console.log( listaDeLinhasDasProducoes[i] );
						
				if( listaDeLinhasDasProducoes[i].indexOf( '->' ) != -1 ){
					this.separarConjuntoDeSentencasParaladoEsquerdo( listaDeLinhasDasProducoes[i].slice(0,listaDeLinhasDasProducoes[i].indexOf('->')), listaDeLinhasDasProducoes[i].slice(listaDeLinhasDasProducoes[i].indexOf('->')+2,listaDeLinhasDasProducoes[i].length) );
				}			
			}

            console.log('TODAS PRODUCOES ');
            console.log(this.producoes);

            if (formaisController.temRecursaoAEsquerda()){
                alert('Esta gramatica não é LL(1). Tem recursão a esquerda.');
                return;
            }



			// Iteracao sobre a lista de NT, busca o FIRST, se conter vazio, gera o follow
			for (i = 0; i < this.listaNaoTerminais.length; i++) {
				
				if( this.isGramaticaLL1() ){
			
					var naoTerminalAtual = this.listaNaoTerminais[i];
					this.getFirst( naoTerminalAtual );
					// Verifica se dentre a lista de first se tem sentenca vazia
					//if( this.listaFirstDeNaoTerminal[naoTerminalAtual].indexOf( this.caractereSentencaVazia ) > -1 ){
					this.getFollow( naoTerminalAtual );
					//}
					
				}
			}
			

			console.log('lista FIRST ');
			console.log(this.listaFirstDeNaoTerminal);
			console.log('lista FOLLOW ');
			console.log(this.listaFollowDeNaoTerminal);


            this.processado = this.gerarTabelaPreditiva();


            console.log('tabela preditiva')
            console.log(formaisController.tabelaPreditiva);

        }

        this.temRecursaoAEsquerda = function(){
            // Iteracao sobre a lista de NT, caso o primeiro elemento de alguma producao for ele mesmo, esta gramatica
            // tem recursao a esquerda
            var temRecursaoAEsquerda = false;

            for (i = 0; i < formaisController.listaNaoTerminais.length; i++) {
                var naoTerminalAtual = this.listaNaoTerminais[i];
                for (y=0; y < formaisController.producoes[naoTerminalAtual].length; y++){
                    var producaoAtual = formaisController.producoes[naoTerminalAtual][y];
                    var primeiroElemento = formaisController.obterPrimeiroElemento(producaoAtual);
                    if (primeiroElemento == naoTerminalAtual){
                        temRecursaoAEsquerda = true;
                        break;
                    }
                }
            }
            return temRecursaoAEsquerda;
        }
		
		
		this.separarLinhasDasProducoes = function(){
		
			var listaDeLinhasDasProducoes = this.conjuntoProducoes.split('\n');
			
			index = listaDeLinhasDasProducoes.indexOf("{");
			if (index > -1) {
				listaDeLinhasDasProducoes.splice(index, 1);
			}
			
			index = listaDeLinhasDasProducoes.indexOf("}");
			if (index > -1) {
				listaDeLinhasDasProducoes.splice(index, 1);
			}
			
			return listaDeLinhasDasProducoes;
		}
		
		this.separarConjuntoDeSentencasParaladoEsquerdo = function( valorladoEsquerdo, valorProducoes ){	
				
			formaisController.producoes[valorladoEsquerdo] = valorProducoes.split("|");
			
			console.log( formaisController.producoes[valorladoEsquerdo] );
		}
		
		this.isGramaticaLL1	 = function(){
			return true;
		}

		this.getFirst = function( naoTerminal ){
			
			// Inicializa lista de first do NT
			if( formaisController.listaFirstDeNaoTerminal[naoTerminal] == null ){
				formaisController.listaFirstDeNaoTerminal[naoTerminal] = [];
			}
			
			// Itera sobre as producoes do NT
			for (var x = 0; x < formaisController.producoes[naoTerminal].length; x++) {
				
				var producaoDoNaoTerminal = formaisController.producoes[naoTerminal][x];			
				
				// Verifica se o primeiro caractere esta na lista de terminais ou é vazio
				if( formaisController.listaTerminais.indexOf( producaoDoNaoTerminal[0] ) > -1
				){
					
					// Adiciona na lista de first do NT
					formaisController.listaFirstDeNaoTerminal[naoTerminal].push( producaoDoNaoTerminal[0] );
					
				// Como o primeiro caractere é um NT, verifica se o NT nao eh o mesmo que se esta criando o FIRST
				}else if( naoTerminal != producaoDoNaoTerminal[0] ||
                    producaoDoNaoTerminal[0] == formaisController.caractereSentencaVazia){

                    var indexAtual = 0;
                    if (producaoDoNaoTerminal[0] != formaisController.caractereSentencaVazia) {
                        // Se ainda nao foi criada a lista FIRST daquele NT
                        if (formaisController.listaFirstDeNaoTerminal[producaoDoNaoTerminal[0]] == null) {
                            this.getFirst(producaoDoNaoTerminal[0]);
                        }

                        // Concatena na lista FIRST
                        formaisController.listaFirstDeNaoTerminal[naoTerminal] = formaisController.listaFirstDeNaoTerminal[naoTerminal].concat(formaisController.listaFirstDeNaoTerminal[producaoDoNaoTerminal[0]]);
                    } else {
                        // Adiciona na lista de first do NT
                        formaisController.listaFirstDeNaoTerminal[naoTerminal].push( producaoDoNaoTerminal[0] );
                        indexAtual = 1;
                    }



                    //se o NT atual gera sentença vazia, o FIRST do proximo elemento estara no first do atual
                    //isto deve ser executado para todos elementos da producao do NT
                    // caso for o ultimo elemento, nao há proximo elemento, por isso, nao precisa passar pela iteração
                    while (indexAtual < (producaoDoNaoTerminal.length -1)) {

                        if (formaisController.produzSentencaVazia(producaoDoNaoTerminal[indexAtual])) {

                            if (naoTerminal != producaoDoNaoTerminal[indexAtual]) {
                                // Se ainda nao foi criada a lista FIRST daquele NT
                                if (formaisController.listaFirstDeNaoTerminal[producaoDoNaoTerminal[indexAtual + 1]] == null) {
                                    this.getFirst(producaoDoNaoTerminal[indexAtual + 1]);
                                }
                                formaisController.listaFirstDeNaoTerminal[naoTerminal] = formaisController.listaFirstDeNaoTerminal[naoTerminal].concat(formaisController.listaFirstDeNaoTerminal[producaoDoNaoTerminal[indexAtual + 1]]);
                            } else {
                                break;
                            }
                        } else {
                            break;
                        }
                        indexAtual++;
                    }



				}
			}
			
			// Retorna somente os itens unicos do array, remove valores duplicados
			formaisController.listaFirstDeNaoTerminal[naoTerminal] = this.retornarSomenteItensUnicosDeArray(formaisController.listaFirstDeNaoTerminal[naoTerminal]);
		}



		this.getFollow = function( naoTerminal ){
			
			// Inicializa lista de follow do NT
			if( formaisController.listaFollowDeNaoTerminal[naoTerminal] == null ){
				formaisController.listaFollowDeNaoTerminal[naoTerminal] = [];
				
				// Se for simbolo de inicio de producao, adicionar final de producao
				if( naoTerminal == formaisController.simboloInicioProducao ){
					formaisController.listaFollowDeNaoTerminal[naoTerminal].push( '$' );
				}
			}
			
			// Itera sobre todos NT
			for (var y = 0; y < formaisController.listaNaoTerminais.length; y++) {
				
				var naoTerminalAtual = formaisController.listaNaoTerminais[y];
				// Itera sobre as producoes do NT
				for (var x = 0; x < formaisController.producoes[ naoTerminalAtual ].length; x++) {
					var producaoDoNaoTerminalAtual = formaisController.producoes[ naoTerminalAtual ][x];
					
					// Se existir na producao o NT
					var posicaoDoNaoTerminalNaProducao = producaoDoNaoTerminalAtual.indexOf(naoTerminal);
					if( posicaoDoNaoTerminalNaProducao > -1 ){
						
						var proximoCaractereDoNaoTerminal = producaoDoNaoTerminalAtual.charAt( posicaoDoNaoTerminalNaProducao+1 );
						// Se nao existir proximo caractere, deve buscar o FOLLOW do NTAtual e concatenar na lista do NT que se esta buscando
						if( proximoCaractereDoNaoTerminal.length == 0 ){

                            if (naoTerminalAtual.indexOf(formaisController.chamadasFollow[naoTerminal]) == -1) {
                                if (formaisController.chamadasFollow[naoTerminal] == undefined){
                                    formaisController.chamadasFollow[naoTerminal] = [];
                                }
                                formaisController.chamadasFollow[naoTerminal].push(naoTerminalAtual);
                                this.getFollow(naoTerminalAtual);
                                formaisController.listaFollowDeNaoTerminal[naoTerminal] = formaisController.listaFollowDeNaoTerminal[naoTerminal].concat(formaisController.listaFollowDeNaoTerminal[naoTerminalAtual]);
                            }


						// Caso o proximo caractere for um terminal, só adiciona a lista
						}else if( formaisController.listaTerminais.indexOf( proximoCaractereDoNaoTerminal ) > -1 ){
							formaisController.listaFollowDeNaoTerminal[naoTerminal].push( proximoCaractereDoNaoTerminal );
							
						// Caso o proximo caractere for um NT, é buscado o FIRST do mesmo
						}else{
							// Se ainda nao tiver sido feita a lista de FIRST do proximo caractere, a mesma é montada
							if( formaisController.listaFirstDeNaoTerminal[ proximoCaractereDoNaoTerminal ] == null ){
								this.getFirst( proximoCaractereDoNaoTerminal );
							}
							formaisController.listaFollowDeNaoTerminal[naoTerminal] = formaisController.listaFollowDeNaoTerminal[naoTerminal].concat( formaisController.listaFirstDeNaoTerminal[ proximoCaractereDoNaoTerminal ] );

                            //caso todos outros elementos a direita produzam sentença vazia, acontece o mesmo que se o elemento estivesse na ultima posicao

                            var outrosElementos = producaoDoNaoTerminalAtual.substr( posicaoDoNaoTerminalNaProducao+1 , producaoDoNaoTerminalAtual.length);
                            console.log('Todos outros elementos para o follow: ' + outrosElementos);
                            var todosProduzemSentencaVazia = true;
                            var index=0;
                            while (todosProduzemSentencaVazia && index < outrosElementos.length){
                                todosProduzemSentencaVazia = formaisController.produzSentencaVazia(outrosElementos.charAt(index));
                                index++;
                            }

                            // caso todos produzem sentença vazia, deve buscar o FOLLOW do NTAtual e concatenar na lista do NT que se esta buscando
                            if (todosProduzemSentencaVazia){
                                if (naoTerminalAtual.indexOf(formaisController.chamadasFollow[naoTerminal]) == -1) {
                                    if (formaisController.chamadasFollow[naoTerminal] == undefined){
                                        formaisController.chamadasFollow[naoTerminal] = [];
                                    }
                                    formaisController.chamadasFollow[naoTerminal].push(naoTerminalAtual);
                                    this.getFollow(naoTerminalAtual);
                                    formaisController.listaFollowDeNaoTerminal[naoTerminal] = formaisController.listaFollowDeNaoTerminal[naoTerminal].concat(formaisController.listaFollowDeNaoTerminal[naoTerminalAtual]);
                                }
                            }


						}
					}				
				}			
			}
			
			// Retorna somente os itens unicos do array, remove valores duplicados
			formaisController.listaFollowDeNaoTerminal[naoTerminal] = this.retornarSomenteItensUnicosDeArray(formaisController.listaFollowDeNaoTerminal[naoTerminal]);
			formaisController.listaFollowDeNaoTerminal[naoTerminal] = this.removerCaractereDeArray( formaisController.listaFollowDeNaoTerminal[naoTerminal], formaisController.caractereSentencaVazia );
		}
		
		this.gerarTabelaPreditiva = function(){
            // if any entry is multiple defined, then the grammar is not LL(1)
            // usando esta logica, caso alguma entrada ja estiver definida no momento de adicionar na tabela
            // esta gramatica não será LL(1)
            var gramaticaLL1 = true;


            formaisController.tabelaPreditiva = [];


            for (var x=0; x < formaisController.listaNaoTerminais.length; x++){
                var naoTerminal = formaisController.listaNaoTerminais[x];

                //tratamento do FIRST
                for (var y=0; y < formaisController.listaTerminais.length; y++){
                    var terminal = formaisController.listaTerminais[y];

                    if (formaisController.listaFirstDeNaoTerminal[naoTerminal].indexOf(terminal) > -1){
                        console.log(terminal + 'esta no first de ' + naoTerminal);

                        var producoes = formaisController.producoes[naoTerminal];
                        for (var z=0; z < producoes.length; z++){
                            var producao = producoes[z];

                            //se a producao gera o first, é colocada nesta posição da tabela
                            if(formaisController.producaoGeraTerminal(producao, terminal)){
                                if (formaisController.tabelaPreditiva[naoTerminal] == undefined){
                                    formaisController.tabelaPreditiva[naoTerminal] = [];
                                }
                                if ( formaisController.tabelaPreditiva[naoTerminal][terminal] != undefined){
                                    gramaticaLL1 = false;
                                }
                                formaisController.tabelaPreditiva[naoTerminal][terminal] = producao;
                            }
                        }


                    }
                }

                if (formaisController.produzSentencaVazia(naoTerminal)) {
                    //tratamento do FOLLOW
                    for (var y = 0; y < formaisController.listaFollowDeNaoTerminal[naoTerminal].length; y++) {
                        var elementoFollow = formaisController.listaFollowDeNaoTerminal[naoTerminal][y];
                        if (formaisController.tabelaPreditiva[naoTerminal] == undefined) {
                            formaisController.tabelaPreditiva[naoTerminal] = [];
                        }

                        if ( formaisController.tabelaPreditiva[naoTerminal][elementoFollow] != undefined){
                            gramaticaLL1 = false;
                        }
                        formaisController.tabelaPreditiva[naoTerminal][elementoFollow] = formaisController.caractereSentencaVazia;
                    }
                }


            }

            if (!gramaticaLL1){
                alert('Esta gramatica não é LL(1)');
                return false;
            }
			return true;
		}

        this.processarSentenca = function(){
            formaisController.pilha = [];

            erro = false;

            var sentencaAux = formaisController.sentenca + formaisController.caractereFimProducao;
            var pilhaAux = formaisController.simboloInicioProducao + formaisController.caractereFimProducao;

            do {
                var registroAtual = new Object();
                registroAtual.pilha = pilhaAux;
                registroAtual.entrada = sentencaAux;

                var pilhaProcessar = formaisController.obterPrimeiroElemento(registroAtual.pilha);
                var entradaProcessar = formaisController.obterPrimeiroElemento(registroAtual.entrada);

                if (entradaProcessar == pilhaProcessar){
                    sentencaAux = sentencaAux.substr( 1, sentencaAux.length);
                    pilhaAux = pilhaAux.substr( 1, pilhaAux.length);
                    if (entradaProcessar == formaisController.caractereFimProducao){
                        registroAtual.acao = 'ACEITA';
                    } else {
                        registroAtual.acao = 'terminal';
                    }

                } else {
                    registroAtual.acao = formaisController.tabelaPreditiva[pilhaProcessar][entradaProcessar];

                    if (registroAtual.acao == '' || registroAtual.acao == undefined){
                        erro = true;
                        registroAtual.acao = "ERRO, não há referencia para " + pilhaProcessar + " e entrada " + entradaProcessar;
                    } else {
                        if (registroAtual.acao == formaisController.caractereSentencaVazia){
                            registroAtual.acao = '';
                        }
                        pilhaAux = registroAtual.acao + pilhaAux.substr( 1, pilhaAux.length);
                        if (registroAtual.acao == ''){
                            registroAtual.acao = formaisController.caractereSentencaVazia;
                        }
                    }
                }


                formaisController.pilha.push(registroAtual);
            } while ((registroAtual.pilha != formaisController.caractereFimProducao || registroAtual.entrada != formaisController.caractereFimProducao) && !erro)

            formaisController.sentencaProcessada = true;
        }

        this.obterPrimeiroElemento = function(string){
            return string[0];
        }

        this.produzSentencaVazia = function(elemento){
            // se for um terminal, método retorna false
            if (formaisController.listaTerminais.indexOf( elemento ) > -1 ){
                return false;
            }

            var producoes = formaisController.producoes[elemento];
            for (var i=0; i < producoes.length; i++){
                if (formaisController.caractereSentencaVazia == producoes[i]){
                    return true;
                }
            }
            return false;
        }

        this.producaoGeraTerminal = function(producao, terminal){
            for (var x=0; x < producao.length; x++){
                var elemento = producao[x];

                if (elemento == formaisController.caractereSentencaVazia){
                    continue;
                }
                // se for um terminal, deve ser igual ao parametro
                if (this.listaTerminais.indexOf(elemento) > -1){
                    if (elemento == terminal){
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    // se esta no first do nao terminal, a producao gera este terminal
                    if (this.listaFirstDeNaoTerminal[elemento].indexOf(terminal) > -1){
                        return true;
                    } else {
                        // caso o terminal desejado nao esteja no first e nao gere sentenca vazia, a producao nao gera este terminal
                        if (!this.produzSentencaVazia(elemento)){
                            return false;
                        }
                    }
                }
            }
            return false;
        }
		
		this.retornarSomenteItensUnicosDeArray = function(a){
			var seen = {};
			var out = [];
			var len = a.length;
			var j = 0;
			for(var i = 0; i < len; i++) {
				 var item = a[i];
				 if(seen[item] !== 1) {
					   seen[item] = 1;
					   out[j++] = item;
				 }
			}
			return out;
		}
		
		this.removerCaractereDeArray = function(array, caractere){
			var index = array.indexOf(caractere);
			if (index > -1) {
				array.splice(index, 1);
			}
			
			return array;
		}
	});
