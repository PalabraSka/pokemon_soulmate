let runs = []
let encounters = []
let pokedex = []

const run = {
  idx: -1,
  name: "",
  player_1: "Player 1",
  player_2: "Player 2",
  is_active: false,
  generation_index: "",
  pokedex_key: "",
  encounters: []
}
  
const pokemon = {
  name: "",
  sprite: "",
  species: "",
  type1: null,
  type2: null
}

const encounter = {
  idx: -1,
  location: "",
  name: "",
  pokemon_1: Object.create(pokemon),
  pokemon_2: Object.create(pokemon),
  alive: true
} 

let current_run_id = -1

/* saves keys */
const key_runs = "runs"

/* data lists */
let datalist_generations = document.getElementById("datalist_generations")
let datalist_pokedex = document.getElementById("datalist_pokedex")

/* flat data */
const generations_array = ["generation-i", "generation-ii", "generation-iii", "generation-iv", "generation-v", "generation-vi", "generation-vii", "generation-viii", "generation-ix"]
const types_location = "static/images/types/"
const types_format = ".png"
const type_unknown = "unknown"
const type_null = "unknown"
const sprite_unknown = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201-question.png"

/* rules */
let rule_cross_player_dupe = true
let rule_different_type_encounter = true
let rule_different_type_team = true
let rule_different_type_team_cross_player = true

/* pop-ups items */
const pop_up = document.getElementById("pop-up_main")
const pop_up_encounter = document.getElementById("pop-up_encounter")
const pop_up_new_run = document.getElementById("pop-up_new_run")
const pop_up_array = [
  pop_up_encounter,
  pop_up_new_run
]

/* Pop-up encounter items */
const pop_up_encounter_location = document.getElementById("encounter_location")
const pop_up_encounter_name = document.getElementById("encounter_name")
const pop_up_encounter_pokemon1 = document.getElementById("encounter_pokemon_1")
const pop_up_encounter_pokemon1_img = document.getElementById("encounter_pokemon_1_img")
const pop_up_encounter_pokemon1_type1 = document.getElementById("encounter_pokemon_1_type_1")
const pop_up_encounter_pokemon1_type2 = document.getElementById("encounter_pokemon_1_type_2")
const pop_up_encounter_pokemon2 = document.getElementById("encounter_pokemon_2")
const pop_up_encounter_pokemon2_img = document.getElementById("encounter_pokemon_2_img")
const pop_up_encounter_pokemon2_type1 = document.getElementById("encounter_pokemon_2_type_1")
const pop_up_encounter_pokemon2_type2 = document.getElementById("encounter_pokemon_2_type_2")
const pop_up_encounter_state = document.getElementById("encounter_state")

/* Pop-up encounter values */
let pop_up_encounter_object = Object.create(encounter)

/* Pop-up new run items */
const pop_up_new_run_name = document.getElementById("new_run_name")
const pop_up_new_run_generation = document.getElementById("new_run_generation_input")
const pop_up_new_run_player_1 = document.getElementById("new_run_player_1")
const pop_up_new_run_player_2 = document.getElementById("new_run_player_2")

/* Tab input */
const tab_menu = document.getElementById("tablink_menu")
const tab_encounters = document.getElementById("tablink_encounters")
const tab_teams = document.getElementById("tablink_teams")

/* Menu buttons */
const bt_menu_continue = document.getElementById("bt_menu_continue")
const bt_menu_new = document.getElementById("bt_menu_new_run")
const bt_menu_load = document.getElementById("bt_menu_load_run")

/* Encounters tab content */
const encounters_div = document.getElementById("encounters_div")
const encounter_name = document.getElementById("encounter_name")
const encounter_id = "encounter_"
const encounter_class = "encounter"


/*********************************************************************
*  Load and save data functions
*********************************************************************/
function load_runs() {
  const local_data = localStorage.getItem(key_runs)
  
  if (!local_data) {
    return
  }

  runs = JSON.parse(local_data)

  for (const idx in runs) {
    runs[idx].idx = idx
    if (runs[idx].is_active && current_run_id == -1) {
      current_run_id = idx
    } else {
      runs[idx].is_active = false
    }
  }
}

// Datalists
function load_datalist_generations() {
  const new_datalist = document.createElement("datalist")
  new_datalist.id = datalist_generations.id
  datalist_generations.replaceWith(new_datalist)
  datalist_generations = new_datalist
  
  for (var i = 0; i < generations_array.length; i++) {
    const option = document.createElement("option")
    option.value = generations_array[i]
    datalist_generations.appendChild(option)
  }
}

function load_datalist_pokedex() {
  const new_datalist = document.createElement("datalist")
  new_datalist.id = datalist_pokedex.id
  datalist_pokedex.replaceWith(new_datalist)
  datalist_pokedex = new_datalist
  
  console.log(pokedex)
  for (var i = 0; i < pokedex.length; i++) {
    console.log(pokedex[i])
    const option = document.createElement("option")
    option.value = pokedex[i].name
    datalist_pokedex.appendChild(option)
  }
}

// Encounters
function save_encounters() {
  const string_encounters = JSON.stringify(encounters)

  localStorage.setItem(encounters_key, string_encounters)
}

function load_encounters(_run = -1) {
  const old_encounters = localStorage.getItem(encounters_key)
  if (old_encounters) {
    encounters = JSON.parse(old_encounters)
    render_encounters()
  }
}

/*********************************************************************
*  Data get/set/check functions
*********************************************************************/

function get_generation_index(generation) {
  if (generations_array.includes(generation)) {
    return generations_array.indexOf(generation)
  } else {
    return -1
  }
}

function get_pokemon_data(name) {
  console.log("got :", name, "| return :")
  for (let i = 0; i < pokedex.length; i++) {
    if (pokedex[i].name == name) {
      console.log(pokedex[i])
      return pokedex[i]
    }
  }
  console.log(null)
  return null
}

function is_encounter_valid(encounter) {
  if (!is_pokemon_dupe(encounter.pokemon_1, encounter.idx)) {
    return false
  }
  if (!is_pokemon_dupe(encounter.pokemon_2, encounter.idx)) {
    return false
  }
  if (encounter.pokemon_1.type1 == encounter.pokemon_2.type1) {
    return false
  }
  if (encounter.pokemon_1.species == encounter.pokemon_2.species) {
    return false
  }
  
  return true
}

function is_pokemon_dupe(pokemon_, soulmate, encounter_idx = -1) {
  for (let i = 0; runs[current_run_id].encounters.length; i++) {
    if (i != encounter_idx) {
      if (runs[current_run_id].encounters[i].pokemon_1.species == pokemon_.species || runs[current_run_id].encounters[i].pokemon_2.species == pokemon_.species) {
        return true
      }
    } else {
      if (runs[current_run_id].encounters[i].pokemon_1.species == pokemon_.species && runs[current_run_id].encounters[i].pokemon_2.species == pokemon_.species) {
        return true
      }
    }
  }
  return false
}

/*********************************************************************
*  Menu tab functions
*********************************************************************/
function load_menu() {

  /* toggle current run info and continue button */
  if (current_run_id >= 0 && current_run_id < runs.length) {
    bt_menu_continue.disabled = false
    load_current_run_display()
  } else {
    bt_menu_continue.disabled = true
  }

  /* toggle load run button */
  bt_menu_load.disabled = !(runs.length > 0)
  
}

function load_current_run_display() {
  return
}

function continue_run() {
  return
}

function new_run() {
  toggle_pop_up(pop_up_new_run)
}

function start_new_run() {
  if (pop_up_new_run_generation.value == "") {
    alert("You need to select a generation to start a new run")
    return
  }
  
  var new_run = structuredClone(run)

  new_run.idx = runs.length

  if (pop_up_new_run_name.value == "") {
    new_run.name = "Run " + new_run.idx + 1
  } else {
    new_run.name = pop_up_new_run_name.value
  }

  if (pop_up_new_run_player_1.value == "") {
    new_run.player_1 = "Player 1"
  } else {
    new_run.player_1 = pop_up_new_run_player_1.value
  }

  if (pop_up_new_run_player_2.value == "") {
    new_run.player_2 = "Player 2"
  } else {
    new_run.player_2 = pop_up_new_run_player_2.value
  }
  
  new_run.is_active = false
  new_run.generation_index = get_generation_index(pop_up_new_run_generation.value)
  new_run.pokedex_key = pop_up_new_run_generation.value
  new_run.encounters = []

  runs.push(new_run)

  load_run(new_run.idx)
  close_all_pop_ups()
  tab_encounters.click()
}

function open_runs_pop_up() {
  return
}

function close_runs_pop_up() {
  return
}

function load_run(idx) {
  for (var i = 0; i < runs.length; i++) {
    runs[i].is_active = false
  }
    
  runs[idx].is_active = true
  current_run_id = idx

  tab_encounters.disabled = false
  tab_teams.disabled = false
  
  load_menu()
  load_pokedex()
  render_encounters()
  generate_teams()
  
}

function load_pokedex() {
  const data = localStorage.getItem(runs[current_run_id].pokedex_key)
  if (data != null) {
    pokedex = JSON.parse(data)
    load_datalist_pokedex()
  } else {
    build_pokedex(runs[current_run_id].generation_index)
  }
}

function wait_pokedex(dex_size) {
  if(pokedex.length < dex_size) {
    window.setTimeout(function() { wait_pokedex(dex_size); }, 50); /* this checks the flag every 50 milliseconds*/
  } else {
    load_datalist_pokedex()
  }
}

/*********************************************************************
*  Encounters tab functions
*********************************************************************/
function render_encounters() {
  encounters_div.innerHTML = null;

  for (const [idx, item] of Object.entries(encounters)) {
    const container = document.createElement("div")
    container.id = encounter_id + idx.toString()
    container.className = encounter_class
    
    //const text = document.createElement("input")
    //text.textContent = item
    //text.style.display = "inline"
    //text.style.marginRight = "10px"

    const input = document.createElement("input")
    input.type = "text"
    input.id = encounter_id + idx.toString() + "_input"
    input.placeholder = item
    input.value = item
    input.style.display = "inline"
    input.className = encounter_class

    const button_edit = document.createElement("button")
    button_edit.textContent = "edit"
    button_edit.onclick = () => open_encounter_pop_up(idx)
    button_edit.className = encounter_class
    
    const button_del = document.createElement("button")
    button_del.textContent = "delete"
    button_del.onclick = () => remove_encounter(idx)
    button_del.className = encounter_class

    container.appendChild(input)
    container.appendChild(button_edit)
    container.appendChild(button_del)
    
    encounters_div.appendChild(container)
  }
}

/*********************************************************************
*  Encounter pop-up functions
*********************************************************************/
function open_encounter_pop_up(idx = -1) {
  if (idx < 0) {
    render_encounter_pop_up()
    pop_up_encounter_obect = Object.create(encounter)
  } else {
    render_encounter_pop_up(runs[current_run_id].encounters[idx])
    pop_up_encounter_object = runs[current_run_id].encounters[idx]
  }
  toggle_pop_up(pop_up_encounter)
}

function render_encounter_pop_up(encounter = null) {
  if (encounter == null){
    pop_up_encounter_location.value = ""
    pop_up_encounter_name.value = ""
    pop_up_encounter_pokemon1.value = ""
    pop_up_encounter_pokemon1_img.src = sprite_unknown
    pop_up_encounter_pokemon1_type1.src = types_location + type_unknown + types_format
    pop_up_encounter_pokemon1_type2.src = types_location + type_unknown + types_format
    pop_up_encounter_pokemon2.value = ""
    pop_up_encounter_pokemon2_img.src = sprite_unknown
    pop_up_encounter_pokemon2_type1.src = types_location + type_unknown + types_format
    pop_up_encounter_pokemon2_type2.src = types_location + type_unknown + types_format
    pop_up_encounter_state.src = ""
  } else {
    pop_up_encounter_location.value = encounter.location
    pop_up_encounter_name.value = encounter.name
    render_pokemon_1(encounter.pokemon_1)
    render_pokemon_2(encounter.pokemon_2)
    pop_up_encounter_state.src = ""
  }  
}

function render_pokemon_1(_pokemon) {
    pop_up_encounter_pokemon1.value = _pokemon.name
    pop_up_encounter_pokemon1_img.src = _pokemon.sprite
    pop_up_encounter_pokemon1_type1.src = types_location + _pokemon.type1 + types_format
    if (_pokemon.type2 == null){
      pop_up_encounter_pokemon1_type2.src = types_location + type_null + types_format
    } else {
      pop_up_encounter_pokemon1_type2.src = types_location + _pokemon.type2 + types_format
    }      
}

function render_pokemon_2(_pokemon) {
    pop_up_encounter_pokemon2.value = _pokemon.species
    pop_up_encounter_pokemon2_img.src = _pokemon.sprite
    pop_up_encounter_pokemon2_type1.src = types_location + _pokemon.type1 + types_format
    if (_pokemon.type2 == null){
      pop_up_encounter_pokemon2_type2.src = types_location + type_null + types_format
    } else {
      pop_up_encounter_pokemon2_type2.src = types_location + _pokemon.type2 + types_format
    }      
}

function close_encounter_pop_up() {
  pop_up.style.display = "none"
  pop_up_encounter.style.display = "none"
}

function remove_encounter(idx) {
  encounters.splice(idx, 1)
  render_encounters()
  save_encounters()
}

function edit_encounter(idx) {
  encounters[idx] = document.getElementById(encounter_id + toString(idx) + "_input").value
}

function save_encounter(idx = -1) {
  const location = encounter_name.value;

  if (!value) {
    alert("Not a pokemon !")
    return
  }

  encounters.push(value)
  render_encounters()
  save_encounters()
  encounter_name.value = ""
}

/* pop-up encounter event listeners */
pop_up_encounter_location.addEventListener('input', function(evt) {
  const new_location = pop_up_encounter_location.value
  pop_up_encounter_object.location = new_location
})

pop_up_encounter_name.addEventListener('input', function(evt) {
  const new_name = pop_up_encounter_name.value
  pop_up_encounter_object.name = new_name
})

pop_up_encounter_pokemon1.addEventListener('input', function(evt) {
  const new_pokemon = get_pokemon_data(pop_up_encounter_pokemon1.value)
  
  if (new_pokemon != null) {
    render_pokemon_1(new_pokemon)
    pop_up_encounter_object.pokemon_1 = new_pokemon
  }
})

pop_up_encounter_pokemon2.addEventListener('input', function (evt) {
  const new_pokemon = get_pokemon_data(pop_up_encounter_pokemon2.value)
  
  if (new_pokemon != null) {
      render_pokemon_2(new_pokemon)
      pop_up_encounter_object.pokemon_2 = new_pokemon
  }
})

/*********************************************************************
*  Teams tab functions
*********************************************************************/
function generate_teams() {
  return
}

/*********************************************************************
*  Main page functions
*********************************************************************/
function load_page() {
  // load data
  load_runs()
  load_datalist_generations()
  
  // close pop-ups
  close_all_pop_ups()

  // load tabs content
  load_menu()
  if (current_run_id == -1) {
    tab_encounters.disabled = true
    tab_teams.disabled = true   
  } else {
    render_encounter()
    generate_teams()
  }

  // prepare tabs
  tab_menu.click()
  
}

// Pop-up management
function toggle_pop_up(target) {
  close_all_pop_ups()
  pop_up.style.display = "block"
  target.style.display = "block"
}

function close_all_pop_ups() {
  pop_up.style.display = "none"
  
  for (var i = 0; i < pop_up_array.length; i++) {
    pop_up_array[i].style.display = "none"
  }
}

// TAB MANAGEMENT
function open_tab(evt, tab_name) {
  // Declare all variables
  var i, tab, tablink;

  // Get all elements with class="tabcontent" and hide them
  tab = document.getElementsByClassName("tab");
  for (i = 0; i < tab.length; i++) {
    tab[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablink = document.getElementsByClassName("tablink");
  for (i = 0; i < tablink.length; i++) {
    tablink[i].className = tablink[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(tab_name).style.display = "block";
  evt.currentTarget.className += " active";
}

/*********************************************************************
*  POKEDEX BUILDER !!!!!!!!!!!
*********************************************************************/
const api_url = "https://pokeapi.co/api/v2/"
const generation_url = "generation/"
const generations_nb = [151, 100, 135, 107, 156, 72, 88, 96, 120]

let dex_size = -1

function build_pokedex(generation) {
  if (generation < 0 || generation >= generations_array.length) {
    return
  }

  pokedex = []
  const nb_species = count_species(generation)
  dex_size = nb_species

  fetch(api_url + "/pokemon?limit=" + nb_species.toString())
    .then(response => response.json())
    .then(function(allpokemon) {
      console.log(allpokemon.results)
      allpokemon.results.forEach(function(pokemon) {
        fetch_pokemon_data(pokemon, generation)
      })
    })
  
  check_dex_size(generation)
}

function fetch_pokemon_data(pokemon, gen) {
  let url = pokemon.url // <--- this is saving the pokemon url to a variable to use in the fetch. 
  let new_pokemon

  console.log("processing data for pokemon :")
  console.log(pokemon)
  
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
          console.log(poke_obj)
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
      return null
    }    
  }
  if (pokemon.types.length > 1) {
    return pokemon.types["1"].type.name
  }
  return null
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
    load_datalist_pokedex()
    const string_pokedex = JSON.stringify(pokedex)
    localStorage.setItem(generations_array[generation], string_pokedex)
  }
}

// loading page
document.addEventListener("DOMContentLoaded", load_page)
