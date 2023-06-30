'''
  Para execurar , após iniciar o virtual enviromente, execute no terminal :

      python app.py

'''


from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/processar_fala', methods=['POST'])
def processar_fala():
    atendente_fala = request.json['atendenteFala']

    # Converter a fala do atendente em texto usando a biblioteca ResponsiveVoice.js
    resposta = "Fala do atendente reproduzida com sucesso!"

    return jsonify({'resposta': resposta})

if __name__ == '__main__':
    app.run(debug=True)
