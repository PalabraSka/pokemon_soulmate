/*********************************************************************
*  POKEDEX BUILDER !!!!!!!!!!!
*********************************************************************/
const api_url = "https://pokeapi.co/api/v2/"
const generation_url = "generation/"
const pokemon_species_url = "pokemon-species/"
const generations_nb = [151, 100, 135, 107, 156, 72, 88, 96, 120]

let dex_size = -1

function build_pokedex(generation) {
  if (generation < 0 || generation >= generations_array.length) {
    return
  }

  console.log("build_pokedex(generation = '" + generation + "')")
  
  pokedex = []
  const nb_species = count_species(generation)
  dex_size = nb_species

  for (let idx = 1; idx <= nb_species; idx++) {
    fetch(api_url + pokemon_species_url + idx.toString())
    .then(response => response.json())
    .then(function(pokemon_species) {
      //console.log(allpokemon.results)
      pokemon_species.results.varieties.forEach(function(pokemon_varieties) {
        fetch_pokemon_data(pokemon_varieties, generation)
      })
    })
  /*  
  fetch(api_url + "/pokemon?limit=" + nb_species.toString())
    .then(response => response.json())
    .then(function(allpokemon) {
      //console.log(allpokemon.results)
      allpokemon.results.forEach(function(pokemon) {
        fetch_pokemon_data(pokemon, generation)
      })
    })
  */
  check_dex_size(generation)
}

function fetch_pokemon_species(pokemon, gen) {
  let url = pokemon.species.url // <--- this is saving the pokemon url to a variable to use in the fetch. 
  let new_pokemon

  //console.log("processing data for pokemon :")
  //console.log(pokemon)
  
  fetch(url)
    .then(response => response.json())
    .then(function(pokeData){
        fetch_pokemon_varieties(pokeData, gen)
    })
}

function fetch_pokemon_varieties(pokemon, gen) {
  //console.log("processing data for pokemon :")
  //console.log(pokemon)
  for (let i = 0; i < pokemon.varietes.length; i++) {
    let url = pokemon.varieties[i].pokemon.url // <--- this is saving the pokemon url to a variable to use in the fetch. 
    fetch(url)
      .then(response => response.json())
      .then(function(pokeData){
          fetch_pokemon_data(pokeData, gen)
      })
  }
}

function fetch_pokemon_data(pokemon, gen) {
  let url = pokemon.url // <--- this is saving the pokemon url to a variable to use in the fetch. 
  let new_pokemon

  //console.log("processing data for pokemon :")
  //console.log(pokemon)
  
  fetch(url)
    .then(response => response.json())
    .then(function(pokeData){
        const new_name = pokeData.species.name
        const new_sprite = pokeData.sprites.front_default
        const new_type1 = get_type_1(pokeData, gen)
        const new_type2 = get_type_2(pokeData, gen)
        new_pokemon = structuredClone(pokemon)
        new_pokemon.name = new_name
        new_pokemon.sprite = new_sprite
        new_pokemon.type1 = new_type1
        new_pokemon.type2 = new_type2
        new_pokemon.species = null
        get_first_evolution(pokeData, gen, new_pokemon)
    })
}

function get_first_evolution(pokemon, gen, poke_obj){
  fetch(pokemon.species.url)
    .then(response => response.json())
    .then(function(pokeData){
      if (!pokeData.evolution_chain.url) {
        species = pokeData.name
      } else {
        fetch(pokeData.evolution_chain.url)
        .then(response => response.json())
        .then(function(pokeData2) {
          poke_obj.species = pokeData2.chain.species.name
          //console.log(poke_obj)
          pokedex.push(poke_obj)
        })
      }
    })
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
      return "unknown"
    }    
  }
  if (pokemon.types.length > 1) {
    return pokemon.types["1"].type.name
  }
  return "unknown"
}

function is_this_gen_included(generation_to_check, generation_index) {
  var idx = generations_array.indexOf(generation_to_check)

  if (idx <= generation_index) {
    return true
  } else {
    return false
  }
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

function check_dex_size(generation) {
  if(pokedex.length < dex_size) {
    window.setTimeout(function() { check_dex_size(generation); }, 100); /* this checks the flag every 100 milliseconds*/
  } else {
    console.log("Pokedex fully built !")
    load_datalist_pokedex()
    const string_pokedex = JSON.stringify(pokedex)
    localStorage.setItem(generations_array[generation], string_pokedex)
  }
}
