const makeCallButton = document.getElementById('makeCallButton');
const responseContainer = document.getElementById('responseContainer');
const audio = new Audio('./static/phone-calling-153844.mp3');
var clienteFala = "";


const initiatePhoneCall = () => {
      makeCallButton.click() 
  
}
    

const simulaAtendimento = () => {
    audio.pause();
    
    responsiveVoice.speak('Alô?! Aqui é da pizzaria Flor de Madureira.', 'Brazilian Portuguese Male', {
      onend: () => {

         // Refacturar se baseando em https://codepen.io/Web_Cifar/pen/jOqBEjE                              


        
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'pt-BR';
  
        recognition.start();
  
        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            responseContainer.innerText = `Resposta do cliente: ${result}`;
    
            // Enviar a resposta do cliente para o Flask
            fetch('/processar_resposta', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ respostaCliente: result })
            })
              .then(response => response.text())
              .then(data => {
                   
              })
              .catch(error => {
                   console.error('Erro:', error);
              });
        };
      }
    });    
};    


makeCallButton.addEventListener('click', () => {

  try {
      throw new Error('Fluxo desviado enquanto nao tenho uma pizaria de verdade');
  
      // Quando possivel contatar uma empresa de delivery 
      window.location.href = 'tel:1-562-867-5309';
  
  
  } catch (error) {     
      audio.volume = 0.1; 
      audio.play();
      setTimeout(()=>{simulaAtendimento()}, 9000);                
      // setTimeout(()=>{responsiveVoice.speak("clienteFala", 'Brazilian Portuguese Female')}, 10000);              
  }
              
});
