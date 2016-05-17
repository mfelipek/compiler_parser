
	var app = angular.module('Trabformais',[]);
	
	app.controller('FormaisController', function(){
			
			
		this.terminais = 'a,b';
		this.naoTerminais = 'A,B,S';		
		this.simboloProducao = 'P';
		this.simboloInicioProducao = 'S';
		this.conjuntoProducoes = 'S->AB|A|B\nA->a|Aa\nB->b|Bb';;
		
		this.listaTerminais = [];
		this.listaNaoTerminais = [];
		this.listaConjuntoProducoes = [];
		
		this.producoes = [];
	
		var formaisController = this;
		this.gerarSentencas = function(){
			this.listaTerminais = [];
			this.producoes = [];
			this.listaNaoTerminais = [];
			this.listaConjuntoProducoes = [];
			
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
			
			
			if( this.isGramaticaLL1() ){
			
				this.getFirst('A');
				this.getFollow('B');
				this.gerarTabelaPreditiva();
			
			}
			console.log(this.producoes);
			console.log(this.producoes['A']);
			
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

		this.getFirst = function(){
			return null;
		}
		
		this.getFollow = function(){
			return null;
		}
		
		this.gerarTabelaPreditiva = function(){
			return null;
		}		 
	});
