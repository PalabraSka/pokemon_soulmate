from flask import Flask, render_template, request
from pokemon import get_pokemon

app = Flask(__name__)

@app.route('/')
@app.route('/index')
def index():
  return "Hello World!"

