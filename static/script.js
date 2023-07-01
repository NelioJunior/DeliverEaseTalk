const makeCallButton = document.getElementById('makeCallButton');
const responseContainer = document.getElementById('responseContainer');
var clienteFala = ""

startSimulationButton = function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', '/start_simulation', true);
  xhr.onreadystatechange = function() {
    makeCallButton.click();
    if (xhr.readyState === 4 && xhr.status === 200) {
        makeCallButton.click();
        
        clienteFala = xhr.responseText;
    }
  };
  xhr.send();
}


makeCallButton.addEventListener('click', () => {

  try {
      throw new Error('Erro simulado!');
  
      // Quando possivel contatar uma empresa de delivery 
      window.location.href = 'tel:1-562-867-5309';
  
  
  } catch (error) {

      const audio = new Audio('http://127.0.0.1:5000/static/phone-calling-153844.mp3');
      audio.volume = 0.1; 
      audio.play();

      const simulaAtendimento = () => {
        audio.pause();
        
        responsiveVoice.speak('Alô?! Aqui é da pizzaria Flor de Madureira.', 'Brazilian Portuguese Male', {
          onend: () => {
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

      setTimeout(simulaAtendimento, 7000);  
      setTimeout(()=>{responsiveVoice.speak(clienteFala, 'Brazilian Portuguese Female')}, 11000);              
      
  
  }


              
});
