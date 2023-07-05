/*
   O algoritimo a seguir só funciona no Edge ou o Chrome, não adianta insistir no Chromium 
   Também só ira funcionar em um site com certificacao SSH  (HTTPS) ou local (localhost)

   Para que seja possivel o acesso a dispositivos moveis, para testes esta sendo usado o 
   componente ngrok

            Exemplo de execução 

                        ngrok http 8000
  

    Para simulações com o SpeechRecognition do navegador  set flagEnableSimulation = true 

  Nell Junior - Jul/23  

*/
const flagEnableSimulation = true;
const makeCallButton = document.getElementById('makeCallButton');
const audio = new Audio('./static/phone-calling-153844.mp3');

var clienteFala = "";
var flagNellyFalando = false;
var flagAnswerPhoneCall = false; 
var flagPhoneCallProgress = false;

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'pt-BR';

recognition.addEventListener("end", () => {
  if (flagEnableSimulation) {
      recognition.start();
  }      
});

window.onload = () => {
    fetch('/enable_simulation');
};

setInterval(()=>{
    fetch('/initiate_phone_call')
        .then(response => response.json())
        .then(data => {
            if (data.flagAnswerPhoneCall && flagPhoneCallProgress == false) {
                flagPhoneCallProgress = true;
                makeCallButton.click()               
            }            
        });
}, 1000);

recognition.addEventListener("result", (e) => {
    const result = event.results[0][0].transcript;
    const results = Array.from(e.results).map((result) => result[0]);
    const transcripts = results.map((result) => result.transcript);

    fetch('/ai_interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ respostaCliente: result })
    }).then(response => 
        response.text()
    ).then(data => {
        flagNellyFalando = true 
        falaAI = JSON.parse(data); 

        setTimeout(()=>{
            responsiveVoice.speak(falaAI.respostaNelli , "Brazilian Portuguese Female", {
                 onend: function() {
                    flagNellyFalando = false;
                    recognition.start();
                 }
            })
        }, 5000)    

    })

});

const simulaAtendimento = () => {
    audio.volume = 0.1; 
    audio.play();
    recognition.start()

    setTimeout(()=>{
        audio.pause();      
        responsiveVoice.speak('Alô?! Aqui é da pizzaria Flor de Madureira.', 'Brazilian Portuguese Male')
    }, 9000)    
};    

makeCallButton.addEventListener('click', () => {
    if (flagEnableSimulation == false) {
        window.location.href = 'tel:1-562-867-5309';      // TODO: Inserir numero valido asim que possivel 
    } else {
        simulaAtendimento();    
    }
});
