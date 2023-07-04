import time
import asyncio
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
flash_message = False

async def  initiate_variable():
    global flash_message
    await asyncio.sleep(30)
    flash_message = True 

@app.route('/')
def index():
    return render_template('index.html', flash_message=flash_message)

@app.route('/initiate_phone_call')
def initiate_phone_call():
    global flash_message
    return jsonify(flash_message=flash_message) 
  
@app.route('/ai_interaction', methods=['POST'])
def ai_interaction():
    data = request.get_json()
    resposta_cliente = data['respostaCliente']

    resposta_nelli = 'Eu me chamo Nelli, e eu gostaria de duas pizzas, uma de quatro queijos e a outra é margherita. '
    resposta_nelli += 'Também quero uma Coca-Cola de 2 litros, por favor.'

    return jsonify({'respostaNelli': resposta_nelli})

if __name__ == '__main__':
    asyncio.run(initiate_variable())
    app.run(debug=True,port=8000,host='0.0.0.0')
