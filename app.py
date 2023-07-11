import requests
import time 
import threading
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
flag_answer_phone_call = False
resposta_nelli = ""

def get_ngrok_domain():
    ngrok_api_url = 'http://127.0.0.1:4040/api/tunnels'
    response = requests.get(ngrok_api_url)
    
    if response.status_code == 200:
        data = response.json()
        tunnels = data['tunnels']
        
        for tunnel in tunnels:
            if tunnel['proto'] == 'https':
                ngrok_domain = tunnel['public_url']
                return ngrok_domain
    
    return None

try: 
    ngrok_domain = get_ngrok_domain()
    if ngrok_domain:
        print(f'O domínio público do Ngrok é: {ngrok_domain}')
    else:
        print('Não foi possível obter o domínio público do Ngrok')
except:
    print('Não foi possível obter o domínio público do Ngrok')

def  initiate_variable():
    global flag_answer_phone_call 
    time.sleep(7)
    flag_answer_phone_call = True 

@app.route('/initiate_phone_call')
def initiate_phone_call():
    global flag_answer_phone_call 
    flag_answer_phone_call = False 
    processo = threading.Thread(target=initiate_variable)
    processo.start()
    return "phone call started"

@app.route('/wait_for_phone_call')
def wait_for_phone_call():
    global flag_answer_phone_call
    return jsonify(flagAnswerPhoneCall=flag_answer_phone_call) 

@app.route('/interaction_delivery_nelly', methods=['POST'])
def interaction_delivery_nelly():
    data = request.get_json()

    delivery_speech = data['deliverySpeech']

    resposta_nelli = 'Oiíí! É a Nelli ligando. Tudo bem? Eu gostaria de duas pizzas, uma de quatro queijos e a outra é margherita. '
    resposta_nelli += 'Também quero uma Coca-Cola de 2 litros, por favor.'

    return jsonify({'respostaNelli': resposta_nelli})


@app.route('/interaction_nelly_delivery', methods=['POST'])
def interaction_nelly_delivery():
    data = request.get_json()  
    nelly_speech = data['nellySpeech']  

    return jsonify({'nellySpeech':nelly_speech })

@app.route('/')
def index():
    return render_template('index.html', flagAnswerPhoneCall=flag_answer_phone_call)

if __name__ == '__main__':
    app.run(debug=True,port=8000,host='0.0.0.0')
