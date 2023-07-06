const flagEnableSimulation = true;

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

let finalTranscript = '';
let partialResults = "";

recognition.onresult = (event) => {

  setTimeout(()=>{

      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
        
      alert("mensagem pizzaria:", finalTranscript);

      if (flagNellyFalando == false) {
        fetch('/ai_interaction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ respostaCliente: finalTranscript})
        }).then(response => 
            response.text()
        ).then(data => {
            falaAI = JSON.parse(data); 
            console.log(falaAI.respostaNelli); 
    
            flagNellyFalando = true 
            recognition.stop();
            
            responsiveVoice.speak(falaAI.respostaNelli , "Brazilian Portuguese Female", {
                 onend: function() {
                    flagNellyFalando = false;
                 }
            })
    
        })               
      }            
}, 2000);

}

const simulaAtendimento = () => {
    try {
        audio.volume = 0.1; 
        audio.play();       
        recognition.stop();
    } catch (error) {}    

    setTimeout(()=>{
        audio.pause(); 
        recognition.start();
        flagPhoneCallProgress = true;
        responsiveVoice.speak('Alô?! Aqui é da pizzaria Flor de Madureira.', 'Brazilian Portuguese Male');
    }, 9000)    
};    

window.onload = () => {
    if (flagEnableSimulation) {
        fetch('/enable_simulation');        

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
    } 
}

makeCallButton.addEventListener('click', () => {  
    makeCallButton.disabled = true;
    
    if (flagEnableSimulation == false) {
        window.location.href = 'tel:+55-11-99750-0734';      // TODO: Inserir numero valido assim que possivel 
    } else {
        simulaAtendimento();    
    }
});

