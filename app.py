'''
  Para execurar , após iniciar o virtual enviromente, execute no terminal :

      python app.py

'''

from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/start_simulation')
def start_simulation():
  res = 'Eu sou a Leonora, e eu gostaria de uma pizza de quatro queijos, por favor.'  
  return res


if __name__ == '__main__':
    app.run(debug=True)
