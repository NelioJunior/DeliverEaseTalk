'''
  Para executar , após iniciar o virtual enviromente, execute no terminal :

      python app.py

'''
import time
import asyncio
from flask import Flask, render_template

app = Flask(__name__)
flash_message = False

@app.route('/')
def index():
    return render_template('index.html', flash_message=flash_message)


async def initiate_phone_call():
    global flash_message
    await asyncio.sleep(7)
    flash_message = True

@app.route('/start_simulation')
def start_simulation():
    res = 'Eu me chamo Nelli, e eu gostaria de duas pizzas, uma é de quatro queijos e a outra é margherita. '
    res += 'Também quero uma Coca-Cola de 2 litros, por favor.'
    return res

if __name__ == '__main__':
    asyncio.run(initiate_phone_call())
    app.run(debug=True, host='0.0.0.0')

