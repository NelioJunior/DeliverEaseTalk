const flagEnableSimulation = false;

const makeCallButton = document.getElementById('makeCallButton');
const audio = new Audio('./static/phone-calling-153844.mp3');
let clienteFala = "";
let flagNellyFalando = false;
let flagAnswerPhoneCall = false; 
let flagPhoneCallProgress = false;
let flagAwaitPizzaOrderClerkResponse = true;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = 'pt-BR';
recognition.start();

let lastTranscript = "";
let previusTranscript
let partialResults = "";

recognition.continuous = true;
recognition.interimResults = false;

recognition.onresult = (event) => {
  let interimTranscript = '';
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) lastTranscript += transcript + ' ';
    else interimTranscript += transcript;
  }
  
  let intervalCount = 0;

  const interval = setInterval(() => {

      if (flagNellyFalando == false && flagPhoneCallProgress) {
          
        lastTranscript = "Fala do atendente:" + lastTranscript 
          
        fetch('/interaction_between_customer_and_delivery', {  
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ answer: lastTranscript})
        }).then(response => 
            response.text()
        ).then(data => {
            let interactionPhrases = JSON.parse(data);         
            let lastPhrase = interactionPhrases[interactionPhrases.length -1].answer;   
            
            if (lastPhrase.substring(0, lastPhrase.indexOf(":") + 1) == "Fala de Nelli:") {
                flagNellyFalando = true; 
                recognition.stop();
                
                let newPhrase = lastPhrase.substring(lastPhrase.indexOf(":") + 1);
                
                responsiveVoice.speak(newPhrase , "Brazilian Portuguese Female", {
                    onend: function() {
                        flagNellyFalando = false;
                        recognition.start(); 
                        clearInterval(interval);
                    }
                })                    
            } else {
                intervalCount += 1;
                if (intervalCount > 7) {
                    clearInterval(interval);
                } 
                   
            }     
        })               
      }    
        
  }, 1000);
        
};

const simulaAtendimento = () => {
    try {
        audio.volume = 0.1; 
        audio.play();       
        recognition.stop();
    } catch (error) {}     
};    

window.onload = () => {
    if (flagEnableSimulation) {
        fetch('/initiate_phone_call');        
    } 

    setInterval(()=>{
        fetch('/wait_for_phone_call')
            .then(response => response.json())
            .then(data => {
                if (data.flagAnswerPhoneCall && flagPhoneCallProgress == false) {
                    flagPhoneCallProgress = true;
                    setTimeout(()=>{
                        flagPhoneCallProgress = false;
                        flagNellyFalando = false},180000);
                        
                    makeCallButton.click()               
                }            
            });
    }, 1000);        
}

makeCallButton.addEventListener('click', () => {  
    makeCallButton.disabled = true;
    
    if (flagEnableSimulation == false) {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
           window.location.href = 'tel:+55-11-99750-0734';
        } else {
           simulaAtendimento();    
        }
    } else {
        simulaAtendimento();    
    }
});
