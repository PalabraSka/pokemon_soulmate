from flask import Flask, render_template, request
from pokemon import get_pokemon
from waitress import serve

app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():
  return render_template('index.html')

@app.route('/pokemon')
def get_pokemon():
  pokemon = request.args.get('pokemon')
  pokemon_data = get_pokemon(pokemon)
  return render_template(
    "pokemon.html",
    name=pokemon_data["name"].capitalize(),
    sprite=pokemon_data["sprites"]["front_defaul"],
    type1=pokemon_data["types"]["0"]["type"]["name"],
    type2="null"
  )

if __name__ == "__main__":
  serve(app, host ="0.0.0.0", port=8000)
