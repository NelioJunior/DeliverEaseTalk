import requests
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
flag_answer_phone_call = False
speach_log = []

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

@app.route('/initiate_phone_call')
def initiate_phone_call(): 
    global flag_answer_phone_call 
    flag_answer_phone_call = True 
    return "True" 

@app.route('/wait_for_phone_call')
def wait_for_phone_call():
    global flag_answer_phone_call
    return jsonify(flagAnswerPhoneCall=flag_answer_phone_call) 

@app.route('/interaction_between_customer_and_delivery', methods=['POST'])
def interaction_between_customer_and_delivery():
    new_request = request.get_json() 

    last_transcript = new_request["answer"]
    payLoad = last_transcript[last_transcript.index(":") + 1:]
   
    if  payLoad != "":
        if len(speach_log) > 0:
            previos_transcript = speach_log[len(speach_log)-1]["answer"]

            if previos_transcript != last_transcript:
                speach_log.append(new_request) 
        else: 
            speach_log.append(new_request) 

    return jsonify(speach_log)

@app.route('/')
def index():
    return render_template('index.html', flagAnswerPhoneCall=flag_answer_phone_call)

if __name__ == '__main__':
    app.run(debug=True,port=8000,host='0.0.0.0')
