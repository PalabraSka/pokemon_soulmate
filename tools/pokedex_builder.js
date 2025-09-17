const api_url = "https://pokeapi.co/api/v2/"
const generation_url = "generation/"
const generations = ["generation-i", "generation-ii", "generation-iii", "generation-iv", "generation-v", "generation-vi", "generation-vii", "generation-viii", "generation-ix"]
const generations_nb = [151, 100, 135, 107, 156, 72, 88, 96, 120]
const encounter_class = "encounter"
const encounters_div = document.getElementById("encounters_div")

let pokedex = []

function pokemon_(pk_name, pk_sprite, pk_species, pk_type1, pk_type2=null) {
  this.name = pk_name
  this.sprite = pk_sprite
  this.species = pk_species
  this.type1 = pk_type1
  this.type2 = pk_type2
}

function render_page() {
  for (let i = 0; i < generations.length; i++) {
    const container = document.createElement("div")
    container.id = i.toString()
    container.className = encounter_class
    
    const text = document.createElement("p")
    text.id = i.toString()
    text.appendChild(document.createTextNode(generations[i]))
    text.style.display = "inline"
    text.width = "250px";
    text.className = encounter_class

    const button_create = document.createElement("button")
    button_create.textContent = "download"
    button_create.onclick = () => build_pokedex(i)
    button_create.className = encounter_class
    
    container.appendChild(text)
    container.appendChild(button_create)
    
    encounters_div.appendChild(container)
  }
}

function build_pokedex(generation) {
  if (generation < 0 || generation >= generations.length) {
    return
  }

  pokedex = []
  const nb_species = count_species(generation)
  console.log(nb_species)

  fetch(api_url + "/pokemon?limit=" + nb_species.toString())
    .then(response => response.json())
    .then(function(allpokemon) {
      console.log(allpokemon.results)
      allpokemon.results.forEach(function(pokemon) {
        fetch_pokemon_data(pokemon, generation)
      })
    })
  
  const string_pokedex = JSON.stringify(pokedex)
  console.log(string_pokedex)
  download_pokedex(string_pokedex, generations[generation])
}

function fetch_pokemon_data(pokemon, gen) {
  let url = pokemon.url // <--- this is saving the pokemon url to a variable to use in the fetch. 
  let new_pokemon
  
  fetch(url)
    .then(response => response.json())
    .then(function(pokeData){
        const new_name = pokeData.species.name
        const new_sprite = pokeData.sprites.front_default
        const new_species = get_first_evolution(pokeData)
        const new_type1 = get_type_1(pokeData, gen)
        const new_type2 = get_type_2(pokeData, gen)
        new_pokemon = new pokemon_(new_name, new_sprite, new_species, new_type1, new_type2)
        pokedex.push(new_pokemon)
    })

  console.log(new_pokemon)
  return new_pokemon
}

function get_first_evolution(pokemon){
  let species
  
  fetch(pokemon.species.url)
    .then(response => response.json())
    .then(function(pokeData){
      if (!pokeData.evolution_chain.url) {
        species = pokeData.name
      } else {
        fetch(pokeData.evolution_chain.url)
        .then(response => response.json())
        .then(function(pokeData2) {
          species = pokeData2.chain.species.name
        })
      }
    })
  return species
}

function get_type_1(pokemon, gen) {
  if (pokemon.past_types["0"]) {
    if (is_this_gen_included(pokemon.past_types["0"].generation.name, gen)) {
      return pokemon.past_types["0"].types["0"].type.name
    }
  }
  return pokemon.types["0"].type.name
}

function get_type_2(pokemon, gen) {
  if (pokemon.past_types["0"]) {
    if (is_this_gen_included(pokemon.past_types["0"].generation.name, gen)) {
      if (pokemon.past_types["0"].types["1"]) {
        if (!pokemon.past_types["0"].types["0"].type.name) {
          return pokemon.past_types["0"].types[1].type.name
        }
      }
    }
    return null
  }
  if (pokemon.types["0"].type[1]) {
    return pokemon.types[1].type.name
  }
  return null
}

function is_this_gen_included(text, generation) {
  return true
}

function count_species(generation) {
    var current_gen = 0
    var nb_species = 0
  
    while (current_gen <= generation) {
      nb_species = nb_species + generations_nb[current_gen]
      current_gen = ++current_gen
    }

    return nb_species
}

function download_pokedex(exportObj, exportName){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href",     dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

render_page()
