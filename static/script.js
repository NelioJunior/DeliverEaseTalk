/*
   O algoritimo a seguir só funciona no Edge ou o Chrome, não adianta insistir no Chromium 

   Também só ira funcionar em um site com certificacao SSH  (HTTPS) ou local (localhost)


  Nell Junior - Jul/23  
*/
const makeCallButton = document.getElementById('makeCallButton');
const responseContainer = document.getElementById('responseContainer');
const audio = new Audio('./static/phone-calling-153844.mp3');
var clienteFala = "";
var flagNellyFalando = false;
var flash_message = false; 

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.lang = 'pt-BR';

recognition.addEventListener("end", () => {
  if (flagNellyFalando == false) {
      recognition.start();
  }      
});

setInterval(initiatePhoneCall, 3000);

function initiatePhoneCall() {
    fetch('/initiate_phone_call')
        .then(response => response.json())
        .then(data => {
            console.log(data.flash_message);
            makeCallButton.click()             
        });
}

recognition.addEventListener("result", (e) => {
    const result = event.results[0][0].transcript;
    const results = Array.from(e.results).map((result) => result[0]);
    const transcripts = results.map((result) => result.transcript);
    responseContainer.innerText = `Resposta do cliente: ${transcripts}`;

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

  try {
      throw new Error('Fluxo desviado enquanto nao tenho uma pizaria de verdade');
  
      // Quando possivel contatar uma empresa de delivery 
      window.location.href = 'tel:1-562-867-5309';
  
  
  } catch (error) {     
      simulaAtendimento();
  }
              
});
