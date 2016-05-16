
	var app = angular.module('Trabformais',[]);
	
	app.controller('FormaisController', function(){
		this.terminais = null;
		this.naoTerminais = null;		
		this.simboloProducao = null;
		this.simboloInicioProducao = null;
		this.conjuntoProducoes = null;
		this.linguagemDaGramatica = null;
		this.numeroSentencas = 3;
		this.numeroMaximoDeDerivacoes = 10;
		
		this.listaTerminais = [];
		this.listaNaoTerminais = [];
		this.listaConjuntoProducoes = [];
		this.listaLadoEsquerdoConjuntoProducao = [];
		this.listaSentencasGeradas = [];
		this.listaSentencasGeradasParaTesteDaLinguagem = [];
		
		this.tipoGramatica = '';
		
		this.gerarSentencas = function(){
			this.listaTerminais = [];
			this.listaNaoTerminais = [];
			this.listaConjuntoProducoes = [];
			this.listaSentencasGeradas = [];
			this.listaSentencasGeradasParaTesteDaLinguagem  = [];
			this.listaTerminais = this.terminais.split(",");			
			this.listaNaoTerminais = this.naoTerminais.split(",");
			
			this.listaLadoEsquerdoConjuntoProducao = [];
			
			
			this.gerarListaConjuntoProducoes();
						
			for(i = 0; i < 200; i++){
				var sentenca = '';
					
				// Pega posicao randomica do simbolo de inicio de producao
				for (x = 0; x < this.listaConjuntoProducoes.length; x++) {
					if( this.listaConjuntoProducoes[x].ladoEsquerdo == this.simboloInicioProducao ){
						// Comeca a lista na posicao 0 e vai ate o tamanho -1, pois comeca no 0
						var posicaoRandomica = Math.round((Math.random() * ( this.listaConjuntoProducoes[x].listaProducoes.length -1 ) + 0));
						sentenca = this.listaConjuntoProducoes[x].listaProducoes[posicaoRandomica];							
					}
				}
				
				console.log("Primeira Sentenca");
				console.log(sentenca);
				
				var derivacoesRealizadas = 0;
				// Enquanto a sentenca conter nao terminais
				while( this.procurarCharactereNaString(sentenca,this.listaLadoEsquerdoConjuntoProducao) != null && this.numeroMaximoDeDerivacoes > derivacoesRealizadas ){
					var ladoEsquerdoEncontradoNaSentenca = this.procurarCharactereNaString(sentenca,this.listaLadoEsquerdoConjuntoProducao);
					console.log("Nao terminal encontrado");
					console.log(ladoEsquerdoEncontradoNaSentenca);
					console.log("Sentenca");
					console.log(sentenca);
					// Incrementa variavel de derivações
					derivacoesRealizadas = derivacoesRealizadas +1;
					
					for (x = 0; x < this.listaConjuntoProducoes.length; x++) {
						if( this.listaConjuntoProducoes[x].ladoEsquerdo == ladoEsquerdoEncontradoNaSentenca ){
							// Comeca a lista na posicao 0 e vai ate o tamanho -1, pois comeca no 0
							var posicaoRandomica = Math.round((Math.random() * ( this.listaConjuntoProducoes[x].listaProducoes.length -1 ) + 0));
							// Substitui o primeiro nao terminal encontrado pela producao randomica gerada
							sentenca = sentenca.replace(ladoEsquerdoEncontradoNaSentenca, this.listaConjuntoProducoes[x].listaProducoes[posicaoRandomica]);							
						}
					}
				}
				
				console.log("Sentenca FINAL" + i);
				console.log(sentenca);

				if( i <= this.numeroSentencas ) {
					this.listaSentencasGeradas.push(sentenca);
				}else{
					this.listaSentencasGeradasParaTesteDaLinguagem.push(sentenca);
				}
			}
			
			console.log("Terminais");
			console.log(this.listaTerminais);
			console.log("Nao Terminais");
			console.log(this.listaNaoTerminais);			
			console.log(this.listaConjuntoProducoes);

			console.log("Sentencas geradas");
			console.log(this.listaSentencasGeradas);
			
			this.identificarTipoDaGramaticaDaProducao();
			this.identificarLinguagemDaGramatica();
			
		};
		
		this.gerarListaConjuntoProducoes = function(){
		
			// Separacao das linhas das producoes
			var listaDeLinhasDasProducoes = this.separarLinhasDasProducoes();
			console.log(listaDeLinhasDasProducoes);			
			
			for (i = 0; i < listaDeLinhasDasProducoes.length; i++) {				
				console.log( listaDeLinhasDasProducoes[i] );
						
				if( listaDeLinhasDasProducoes[i].indexOf( '->' ) != -1 ){
					var conjuntoProducoesGeradas = this.separarConjuntoDeSentencasParaladoEsquerdo( listaDeLinhasDasProducoes[i].slice(0,listaDeLinhasDasProducoes[i].indexOf('->')), listaDeLinhasDasProducoes[i].slice(listaDeLinhasDasProducoes[i].indexOf('->')+2,listaDeLinhasDasProducoes[i].length) );					
					this.listaConjuntoProducoes.push(conjuntoProducoesGeradas);
				}			
			}
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
			
			// Contem um nao terminal e sua lista de producoes
			var producoes = {ladoEsquerdo: '', listaProducoes: [] };
				
			// Seta o lado esquerdo
			producoes.ladoEsquerdo = valorladoEsquerdo;
			//Separa as produçoes
			producoes.listaProducoes = valorProducoes.split("|");
			
			this.listaLadoEsquerdoConjuntoProducao.push( producoes.ladoEsquerdo );
			
			console.log( producoes.ladoEsquerdo );
			console.log( producoes.listaProducoes );			
			
			return producoes;
		}
		
		this.procurarCharactereNaString = function(str, substrings) {
			for (var i = 0; i != substrings.length; i++) {
			   var substring = substrings[i];
			   if (str.indexOf(substring) != - 1) {
				 return substring;
			   }
			}
			
			return null; 
		}
		
		this.identificarTipoDaGramaticaDaProducao = function(){
			this.tipoGramatica = "";
			
			var ehRegular = this.verificarSeEhRegular();
			if( ehRegular ){
			
				this.tipoGramatica = "Regular";
				return true;
			}
			
			var ehLivreContexto = this.verificarSeEhLivreContexto();
			if( ehLivreContexto ){
			
				this.tipoGramatica = "Livre de contexto";
				return true;
			}
			
			var ehSensivelAoContexto = this.verificarSeEhSensivelAoContexto();
			if( ehSensivelAoContexto ){
			
				this.tipoGramatica = "Sensivel ao contexto";
				return true;
			}
			
			this.tipoGramatica = "Irrestrita";
			return true;
		}		
		
		this.verificarSeEhSensivelAoContexto = function(){
			
			for (i = 0; i < this.listaConjuntoProducoes.length; i++) {				
				
				for (x = 0; x < this.listaConjuntoProducoes[i].listaProducoes.length; x++) {

					if( this.listaConjuntoProducoes[i].ladoEsquerdo.length > this.listaConjuntoProducoes[i].listaProducoes[x] ){
						return false;
					}
					
					if( this.procurarCharactereNaString(this.listaConjuntoProducoes[i].listaProducoes[x],'X') != null ){
						return false;
					}
				}				
			}
			
			return true;			
		}
		
		this.verificarSeEhLivreContexto = function(){
			
			for (i = 0; i < this.listaConjuntoProducoes.length; i++) {
				
				// Se tiver mais de um valor na esquerda
				if( this.listaConjuntoProducoes[i].ladoEsquerdo.length > 1){
					return false;
				}
				// Se tiver um valor a esquerda e for T
				if( this.listaConjuntoProducoes[i].ladoEsquerdo.length == 1 && this.listaConjuntoProducoes[i].ladoEsquerdo != this.listaConjuntoProducoes[i].ladoEsquerdo.toUpperCase() ){
					return false;
				}
				
				
				for (x = 0; x < this.listaConjuntoProducoes[i].listaProducoes.length; x++) {

					if( this.procurarCharactereNaString(this.listaConjuntoProducoes[i].listaProducoes[x],'X') != null ){
						return false;
					}
				}				
			}
			
			return true;			
		}
		
		this.verificarSeEhRegular = function(){
			
			for (i = 0; i < this.listaConjuntoProducoes.length; i++) {
				
				// Se tiver mais de um valor na esquerda
				if( this.listaConjuntoProducoes[i].ladoEsquerdo.length > 1){
					return false;
				}
				// Se tiver um valor a esquerda e for T
				if( this.listaConjuntoProducoes[i].ladoEsquerdo.length == 1 && this.listaConjuntoProducoes[i].ladoEsquerdo != this.listaConjuntoProducoes[i].ladoEsquerdo.toUpperCase() ){
					return false;
				}				
				
				for (x = 0; x < this.listaConjuntoProducoes[i].listaProducoes.length; x++) {

					// Se for maior que 2 characteres
					if( this.listaConjuntoProducoes[i].listaProducoes[x].length > 2 ){
						return false;
					// Se tiver tamanho 1 e for um NT
					}else if( this.listaConjuntoProducoes[i].listaProducoes[x].length == 1 ){
						if( this.listaConjuntoProducoes[i].listaProducoes[x] == this.listaConjuntoProducoes[i].listaProducoes[x].toUpperCase() ){
							
							if( this.listaConjuntoProducoes[i].listaProducoes[x].charAt(0) != 'X' ){
								return false;
							}							
						}
					}else if( this.listaConjuntoProducoes[i].listaProducoes[x].length == 2 ){
						
						// Primeiro character eh um NT
						if( this.listaConjuntoProducoes[i].listaProducoes[x].charAt(0) == this.listaConjuntoProducoes[i].listaProducoes[x].charAt(0).toUpperCase() ){
							if( this.listaConjuntoProducoes[i].listaProducoes[x].charAt(0) != 'X' ){
								return false;
							}
						}
						
						// Primeiro charactere eh um T
						if( this.listaConjuntoProducoes[i].listaProducoes[x].charAt(0) != this.listaConjuntoProducoes[i].listaProducoes[x].charAt(0).toUpperCase() ){
							// Segundo charactere eh um T
							if( this.listaConjuntoProducoes[i].listaProducoes[x].charAt(1) != this.listaConjuntoProducoes[i].listaProducoes[x].charAt(1).toUpperCase() ){
								return false;
							}
						}
					}
				}				
			}
			
			return true;			
		}
		
		
		this.identificarLinguagemDaGramatica = function(){
			
			var listaTotalMinimoDoTerminal = [];			
			for (i = 0; i < this.listaTerminais.length; i++) {
				var totalMinimoDoTerminal = { terminal: this.listaTerminais[i], totalMinimo:1000 };
				listaTotalMinimoDoTerminal.push(totalMinimoDoTerminal);
			}
			
			for (i = 0; i < this.listaSentencasGeradasParaTesteDaLinguagem.length; i++) {
				
				var sentenca = this.listaSentencasGeradasParaTesteDaLinguagem[i];
				if( this.procurarCharactereNaString(sentenca,this.listaNaoTerminais) == null ){
					
					for (x = 0; x < listaTotalMinimoDoTerminal.length; x++) {
						var totalOcorrenciasDoTerminal = (sentenca.match(new RegExp(listaTotalMinimoDoTerminal[x].terminal, "g")) || []).length;
						
						if( listaTotalMinimoDoTerminal[x].totalMinimo > totalOcorrenciasDoTerminal ){
							listaTotalMinimoDoTerminal[x].totalMinimo = totalOcorrenciasDoTerminal;
						}
					}
				}
			}
			
			
						
			console.log("TOTAL NAO TERMINAL");
			console.log( listaTotalMinimoDoTerminal );
			
			var linguagem = 'L(G)={';
			var totaisPotencia= '';
			for (i = 0; i < listaTotalMinimoDoTerminal.length; i++) {
				var potencia = this.randomPotenciaGenerator();
				linguagem += listaTotalMinimoDoTerminal[i].terminal + ' ^ ' + potencia + ' ';
				totaisPotencia += potencia + ' >= ' + listaTotalMinimoDoTerminal[i].totalMinimo + ' ';
			}
			linguagem += ' / ' + totaisPotencia + ' }';
			
			this.linguagemDaGramatica = linguagem;
		}
		
		
		this.randomPotenciaGenerator = function(){			

			var text = "";
			var possible = "abcdefghijklmnopqrstuvwxyz";

			for( var i=0; i < 2; i++ )
				text += possible.charAt(Math.floor(Math.random() * possible.length));

			return text;			
		}
		
	});