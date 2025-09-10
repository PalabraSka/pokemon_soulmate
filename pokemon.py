from dotenv import load_dotenv
from pprint import pprint
import requests
import os

load_dotenv()

def get_pokemon(pokemon="pikachu"):
  request_url = f'https://pokeapi.co/api/v2/pokemon/' + pokemon
  pokemon_data = requests.get(request_url).json()

  return pokemon_data

