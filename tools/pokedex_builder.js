const api_url = "https://pokeapi.co/api/v2/"
const generation_url = "generation/"
const generations = ["generation-i", "generation-ii", "generation-iii", "generation-iv", "generation-v", "generation-vi", "generation-vii", "generation-viii", "generation-ix"]

const pokemon = {
  sprite: "",
  species: "",
  type1: null,
  type2: null
}

function build_pokedex(generation) {
    if (generation < 0 || generation >= generations.length) {
        return
    }

    var pokedex = []
    const nb_species = count_species(generation)
    
}

function count_species(generation) {
    var current_gen = 0
    
    while (current_gen <= generation) {
        var nb_species = 0
        
        fetch(api_url + generation_url + generations[current_gen])
            .then(response => response.json())
            .then(function(pokemon_species){
                nb_species = nb_species + pokemon_species.length
            })
              
        current_gen = ++current_gen
    }

    return nb_species
}

function fetch_json(link) {
    if (!typeof link === 'string'){
        return null
    }
    
    let result
    fetch(link)
        .then(res => res.json())
        .then(data => {
            result = data
        })
    return result
}
