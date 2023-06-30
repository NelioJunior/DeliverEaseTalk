const makeCallButton = document.getElementById('makeCallButton');
const responseContainer = document.getElementById('responseContainer');
const callButton = document.getElementById('callButton');

makeCallButton.addEventListener('click', () => {
  const atendenteFala = prompt('Fale com o atendente da pizzaria:');
  responsiveVoice.speak(atendenteFala, 'Brazilian Portuguese Female', {
    onend: () => {
      responseContainer.innerText = 'Fala do cliente reproduzida com sucesso!';
    }
  });
});

callButton.addEventListener('click', () => {
  window.location.href = 'tel:1-562-867-5309';
});
