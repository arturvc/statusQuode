/*statusQuode
Central de mensagens sobre códigos de status HTTP
desenvolvido por arturvc

The messages from this project were copied from
the Internet Assigned Numbers Authority (IANA)
and Internet Engineering Task Force.
For more information about HTTP Status Code, visit IANA website.

São Paulo, jan, 2018.
http://arturvc.net.br/
*/

let teclas = []; // as teclas de 0 a 9
let teclaReset; // a tecla de reset/delete
let teclaInfo; // a tecla de informação introdutória sobre código de status
let statusGeral = []; // informações dos códigos de status HTTP que está em erro.json
let statusPropriedades = []; // armazena todos os números dos códigos de status (100, 101, 102, ..., 511)
let casaAlgarismo = 0; // posição do cursor no display do número do código
let algarismoClicado; // número que foi teclado
let displayAlgarismo = []; // os três algarismos do códigos de status
let displayAlgarismoClicado = []; // o algarismo do código de status que foi teclado
let statusClasse; // exibe informação da classe do código de status
let statusCodigo; // exibe o nome do código de status
let statusUrlLink; // exibie a url do código de status
let linkCodigo = "_"; // armazena a url do código digitado
let numeroStatusQuode; // número do código de status
let statusQuodeMensagem; // a mensagem que será falada pela ResponsiveVoice
let vozes = ["UK English Male", "UK English Female", "US English Female", "Australian Female"]; // vozes do ResponsiveVoice
let vozIndice; // indice para selecionar a voz
let osciladorAlto, osciladorBaixo; // as frequencias DTMF do teclado

function preload() {
  statusGeral = loadJSON("erro.json");
}

function setup() {
  osciladorAlto = new p5.Oscillator(); // frequencia 1 DTMF do teclado
  osciladorBaixo = new p5.Oscillator(); // frequencia 2 DTMF do teclado
  for (let i = 0; i < 3; i++) {
    displayAlgarismo[i] = select("#displayAlgarismo" + i);
  }
  for (let i = 0; i < 10; i++) {
    teclas[i] = select("#tecla" + i);
    teclas[i].mousePressed(algarismoClique); // está com problema: dispara click duplo no Android
  }
  statusClasse = select("#classe");
  statusCodigo = select("#codigo");
  statusUrlLink = select("#urlLink");
  teclaReset = select("#teclaReset");
  teclaInfo = select("#teclaInfo");
  teclaReset.mousePressed(resetar); // está com problema: dispara click duplo no Android
  teclaReset.mouseOut(algarismoOut);
  teclaReset.mouseOver(algarismoOver);
  teclaInfo.mousePressed(welcome); // está com problema: dispara click duplo no Android
  teclaInfo.mouseOut(algarismoOut);
  teclaInfo.mouseOver(algarismoOver);
  for (var key in statusGeral.codigos) {
    statusPropriedades.push(key);
  }
  verificandoCasaAlgarismo();
}

function draw() {
  // put drawing code here
}

function dtmf(numero) {
  let tempo = 0.4;
  let volume = 0.05;
  if (numero == 0) {
    var frequenciaAlto = 1336;
    var frequenciaBaixo = 941;
  }
  if (numero == 1) {
    var frequenciaAlto = 1209;
    var frequenciaBaixo = 697;
  }
  if (numero == 2) {
    var frequenciaAlto = 1336;
    var frequenciaBaixo = 697;
  }
  if (numero == 3) {
    var frequenciaAlto = 1477;
    var frequenciaBaixo = 697;
  }
  if (numero == 4) {
    var frequenciaAlto = 1209;
    var frequenciaBaixo = 770;
  }
  if (numero == 5) {
    var frequenciaAlto = 1336;
    var frequenciaBaixo = 770;
  }
  if (numero == 6) {
    var frequenciaAlto = 1477;
    var frequenciaBaixo = 770;
  }
  if (numero == 7) {
    var frequenciaAlto = 1209;
    var frequenciaBaixo = 852;
  }
  if (numero == 8) {
    var frequenciaAlto = 1336;
    var frequenciaBaixo = 852;
  }
  if (numero == 9) {
    var frequenciaAlto = 1477;
    var frequenciaBaixo = 852;
  }
  if (numero == "i") {
    var frequenciaAlto = 1209;
    var frequenciaBaixo = 941;
  }
  if (numero == "b") {
    var frequenciaAlto = 1477;
    var frequenciaBaixo = 941;
  }
  osciladorAlto.setType('sine');
  osciladorBaixo.setType('sine');
  osciladorAlto.amp(volume);
  osciladorBaixo.amp(volume);
  osciladorAlto.freq(frequenciaAlto);
  osciladorBaixo.freq(frequenciaBaixo);
  osciladorAlto.start();
  osciladorBaixo.start();
  osciladorAlto.stop(tempo);
  osciladorBaixo.stop(tempo);
}

function welcome() {
  dtmf("i");
  vozIndice = int(random(vozes.length));
  responsiveVoice.speak(statusGeral.start, vozes[vozIndice]);
}

function resetar() {
  responsiveVoice.cancel();
  dtmf("b");
  linkCodigo = "_";
  if (casaAlgarismo > 0) {
    casaAlgarismo--;
    statusCodigo.html("_");
    statusUrlLink.html("_");
    statusUrlLink.attribute('href', '#');
    verificandoCasaAlgarismo();
  }
  if (casaAlgarismo == 0) {
    statusClasse.html("_");
    responsiveVoice.cancel();
  }
  verificandoCasaAlgarismo();
  displayAlgarismo[casaAlgarismo].html("x");
}

function algarismoOver() {
  this.style("background-color", "darkorange");
  this.style("color", "lavender");
}

function algarismoOut() {
  this.style("background-color", "dimgray");
  this.style("color", "lavender");
}

function algarismoOverDesativado() {
  this.style("background-color", "dimgray");
  this.style("color", "gray");
}

function algarismoOutDesativado() {
  this.style("background-color", "dimgray");
  this.style("color", "gray");
}

// CLICK!!!
function algarismoClique() {
  vozIndice = int(random(vozes.length)); // escolhendo aleatoriamente a voz
  for (var i = 0; i < teclas.length; i++) {
    if (this == teclas[i]) {
      algarismoClicado = i;
    }
  }
  /////////////////////////// testando se o numero foi clicado corretamente
  if (numerosUnicosAlgarismos.includes(algarismoClicado)) {
    dtmf(algarismoClicado);
    if (casaAlgarismo == 0) {
      displayAlgarismoClicado[casaAlgarismo] = algarismoClicado;
      responsiveVoice.speak(statusGeral.indices[algarismoClicado - 1], vozes[vozIndice]);
      statusClasse.html(statusGeral.classes[algarismoClicado - 1]);
    } else if (casaAlgarismo == 1) {
      displayAlgarismoClicado[casaAlgarismo] = algarismoClicado;
    } else if (casaAlgarismo == 2) {
      displayAlgarismoClicado[casaAlgarismo] = algarismoClicado;
      numeroStatusQuode = String(displayAlgarismoClicado[0]) + String(displayAlgarismoClicado[1]) + String(displayAlgarismoClicado[2]);
      for (var key in statusGeral.codigos) {
        if (numeroStatusQuode == key) {
          statusQuodeMensagem = statusGeral.codigos[key][1];
          responsiveVoice.speak(statusQuodeMensagem, vozes[vozIndice]);
          statusCodigo.html(statusGeral.codigos[key][0]);
          statusUrlLink.html(statusGeral.codigos[key][2]);
          linkCodigo = statusGeral.codigos[key][2];
          console.log(linkCodigo);
          statusUrlLink.attribute('href', linkCodigo)
        }
      }
    }
    ///
    else if (casaAlgarismo == 3) {
      displayAlgarismoClicado[2] = algarismoClicado;
      numeroStatusQuode = String(displayAlgarismoClicado[0]) + String(displayAlgarismoClicado[1]) + String(displayAlgarismoClicado[2]);
      for (var key in statusGeral.codigos) {
        if (numeroStatusQuode == key) {
          statusQuodeMensagem = statusGeral.codigos[key][1];
          responsiveVoice.speak(statusQuodeMensagem, vozes[vozIndice]);
          statusCodigo.html(statusGeral.codigos[key][0]);
          statusUrlLink.html(statusGeral.codigos[key][2]);
          linkCodigo = statusGeral.codigos[key][2];
          statusUrlLink.attribute('href', linkCodigo)
        }
      }
      displayAlgarismo[2].html(algarismoClicado);
    }
    if (casaAlgarismo < 3) {
      displayAlgarismo[casaAlgarismo].html(algarismoClicado);
      casaAlgarismo++;
    }
    verificandoCasaAlgarismo();
  }
  ///////////////////////////
}
//

function verificandoCasaAlgarismo() {
  if (casaAlgarismo == 0) {
    verificandoAlgarismo(0);
    displayAlgarismo[0].style("text-decoration", "underline lavender");
    displayAlgarismo[1].style("text-decoration", "none");
    displayAlgarismo[2].style("text-decoration", "none");
  } else if (casaAlgarismo == 1) {
    verificandoAlgarismo(1);
    displayAlgarismo[0].style("text-decoration", "none");
    displayAlgarismo[1].style("text-decoration", "underline lavender");
    displayAlgarismo[2].style("text-decoration", "none");
  } else if (casaAlgarismo == 2) {
    verificandoAlgarismo(2);
    displayAlgarismo[0].style("text-decoration", "none");
    displayAlgarismo[1].style("text-decoration", "none");
    displayAlgarismo[2].style("text-decoration", "underline lavender");
  }
}

//////////////////////
function verificandoAlgarismo(casa) {
  let algarismos = [];
  // Checando a casa da centena
  if (casaAlgarismo == 0) {
    for (let i = 0; i < statusPropriedades.length; i++) {
      for (let j = 0; j < 10; j++) {
        if (statusPropriedades[i].charAt(casa) == j) {
          algarismos.push(j);
        }
      }
    }
    numerosUnicosAlgarismos = Array.from(new Set(algarismos));
  }
  // Checando a casa da dezena
  else if (casaAlgarismo == 1) {
    for (let i = 0; i < statusPropriedades.length; i++) {
      for (let j = 0; j < 10; j++) {
        if (statusPropriedades[i].charAt(0) == displayAlgarismoClicado[0] && statusPropriedades[i].charAt(casa) == j) {
          algarismos.push(j);
        }
      }
    }
    numerosUnicosAlgarismos = Array.from(new Set(algarismos));
  }
  // Checando a casa da unidade
  else if (casaAlgarismo == 2) {
    for (let i = 0; i < statusPropriedades.length; i++) {
      for (let j = 0; j < 10; j++) {
        if (statusPropriedades[i].charAt(0) == displayAlgarismoClicado[0] && statusPropriedades[i].charAt(1) == displayAlgarismoClicado[1] && statusPropriedades[i].charAt(casa) == j) {
          algarismos.push(j);
        }
      }
    }
    numerosUnicosAlgarismos = Array.from(new Set(algarismos));
  }
  atualizandoTeclado();
}
//////////////////////
function atualizandoTeclado() {
  // Resetando o teclado
  for (let i = 0; i < teclas.length; i++) {
    teclas[i].html(i);
    teclas[i].style("color", "gray");
    teclas[i].mouseOver(algarismoOverDesativado);
    teclas[i].mouseOut(algarismoOutDesativado);
  }
  // Atualizando o teclado
  for (let i = 0; i < numerosUnicosAlgarismos.length; i++) {
    teclas[numerosUnicosAlgarismos[i]].html(numerosUnicosAlgarismos[i]);
    teclas[numerosUnicosAlgarismos[i]].mouseOver(algarismoOver);
    teclas[numerosUnicosAlgarismos[i]].mouseOut(algarismoOut);
    teclas[numerosUnicosAlgarismos[i]].style("color", "lavender");
    teclaReset.style("color", "lavender");
  }
}
