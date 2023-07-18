const flagEnableSimulation = false;

const makeCallButton = document.getElementById('makeCallButton');
const audioPickUp = new Audio('./static/pickup.mp3');
const audioHangUp = new Audio('./static/hangup.mp3');
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const simulating_phrases = [
  'Alô?! Aqui é da pizzaria flor de manjericão',
  'Pode me falar maiores detalhes do seu pedido',
  'Gostaria de adicionar mais itens ao seu pedido?',
  'Nós temos um pudim caramelado delicioso, você não quer adicionar a sobremesa?',
  'O preço ficará em 87reais, já processado em sua conta aqui da pizzaria.',
  'A previsão é de 20 minutos.',
  'Agradecemos sua preferência. Obrigado. Tchau!'
];

let phrases_index = 0;
let clienteFala = "";
let flagNellyFalando = false;
let flagAnswerPhoneCall = false; 
let flagPhoneCallProgress = false;
let flagAwaitPizzaOrderClerkResponse = true;
let lastTranscript = "";
let previusTranscript = "";
let previusNellyPhrase = "";
let previus 
let partialResults = "";

recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = 'pt-BR';
recognition.start();

recognition.onresult = (event) => {
  let interimTranscript = '';
  lastTranscript = '';
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) lastTranscript += transcript + ' ';
    else interimTranscript += transcript;
  }
  
  let intervalCount = 0;

  const interval = setInterval(() => {

      if (flagNellyFalando == false && flagPhoneCallProgress) {
          
        if (!lastTranscript.includes("Fala do atendente:")) {   
          lastTranscript = "Fala do atendente:" + lastTranscript 
        }  
          
        previusTranscript = lastTranscript;

        fetch('/interaction_between_customer_and_delivery', {  
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ answer: lastTranscript})
        }).then(response => 
            response.text()
        ).then(data => {
            const interactionPhrases = JSON.parse(data);                        
            const taker_phrases = interactionPhrases.filter(item => item['answer'].includes("fala de nelli:"));
            
            if (taker_phrases.length > 0) {

                const lastNellyPhrase = taker_phrases[taker_phrases.length -1].answer;   
            
                if (lastNellyPhrase != previusNellyPhrase) {
                    previusNellyPhrase = lastNellyPhrase;                       
                    flagNellyFalando = true; 
                    recognition.stop();
                    
                    let newNellyPhrase = lastNellyPhrase.substring(lastNellyPhrase.indexOf(":") + 1);
                    
                    responsiveVoice.speak(newNellyPhrase , "Brazilian Portuguese Female", {
                        onend: function() {
                            flagNellyFalando = false;
                            recognition.start(); 
                            clearInterval(interval);
                            simulaAtendimento();    
                        }
                    })                    
                } else {
                    intervalCount += 1;
                    if (intervalCount > 7) {
                        clearInterval(interval);
                    } 
                       
                }                         
            } 
        })               
      }        
  }, 2000);
        
};

const simulaAtendimento = () => {
    
    try {
        if (phrases_index == 0) {
            audioPickUp.volume = 0.1; 
            audioPickUp.play();       
        }
        recognition.stop();
    } catch (error) {}                    

    setTimeout(()=>{
        audioPickUp.pause(); 
        recognition.start();
        flagPhoneCallProgress = true;
        responsiveVoice.speak(simulating_phrases[phrases_index],'Brazilian Portuguese Male');
        phrases_index += 1;
        if (phrases_index == simulating_phrases.length) {
           hangUpPhoneCall(3000);
        }            
    }, 6000);    
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
                    hangUpPhoneCall(180000);                           
                    makeCallButton.click();               
                }            
            });
    }, 1000);        
}

hangUpPhoneCall = (time) => {
    setTimeout(()=>{
        fetch('/hang_up_phone_call');  
        flagPhoneCallProgress = false;
        flagNellyFalando = false; 
        audioHangUp.play();                                
    },time);
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
