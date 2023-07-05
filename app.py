import time 
import threading
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
flag_answer_phone_call = False

def  initiate_variable():
    global flag_answer_phone_call 
    time.sleep(30)
    flag_answer_phone_call = True 

@app.route('/enable_simulation')
def enable_simulation():
    global flag_answer_phone_call 
    flag_answer_phone_call = False 
    processo = threading.Thread(target=initiate_variable)
    processo.start()
    return ""

@app.route('/initiate_phone_call')
def initiate_phone_call():
    global flag_answer_phone_call
    return jsonify(flagAnswerPhoneCall=flag_answer_phone_call) 
  
@app.route('/ai_interaction', methods=['POST'])
def ai_interaction():
    data = request.get_json()
    resposta_cliente = data['respostaCliente']

    resposta_nelli = 'Eu me chamo Nelli, e eu gostaria de duas pizzas, uma de quatro queijos e a outra é margherita. '
    resposta_nelli += 'Também quero uma Coca-Cola de 2 litros, por favor.'

    return jsonify({'respostaNelli': resposta_nelli})

@app.route('/')
def index():
    return render_template('index.html', flagAnswerPhoneCall=flag_answer_phone_call)

if __name__ == '__main__':
    app.run(debug=True,port=8000,host='0.0.0.0')
    