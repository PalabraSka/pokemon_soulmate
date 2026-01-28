let runs = []
let pokedex = []

const run = {
  idx: -1,
  name: "",
  player_1: "Player 1",
  player_2: "Player 2",
  is_active: false,
  generation_index: "",
  pokedex_key: "",
  encounters: [],
  teams: []
}
  
const pokemon = {
  index: -1,
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
  pokemon_1: -1,
  pokemon_2: -1,
  alive: true
} 

let pokemon_pool = []

let current_run_id = -1

/* saves keys */
const key_runs = "runs"

/* urls */
const app_url = "https://palabraska.github.io/pokemon_soulmate/"
const generation_data_url = "static/data/"

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
let team_size_max = 6

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
const encounter_class = "encounter_"
const encounter_pokemon_class = "encounter_pokemon_div"

/* Teams tab content */
const teams_div = document.getElementById("teams_div")
const teams_div_array = [
  document.getElementById("teams_div_1"),
  document.getElementById("teams_div_2"),
  document.getElementById("teams_div_3"),
  document.getElementById("teams_div_4"),
  document.getElementById("teams_div_5"),
  document.getElementById("teams_div_6")
]
const teams_filter_array = [
  document.getElementById("teams_filter_1"),
  document.getElementById("teams_filter_2"),
  document.getElementById("teams_filter_3"),
  document.getElementById("teams_filter_4"),
  document.getElementById("teams_filter_5")
]
let filters_array = []
const encounters_pokemons_datalist = document.getElementById("encounters_pokemons_datalist")
const team_id = "team_"
const team_class = "team_"
const team_pokemon_class = "team_pokemon_div"


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

  console.log("Generations datalist loaded !")
}

function load_datalist_pokedex() {
  const new_datalist = document.createElement("datalist")
  new_datalist.id = datalist_pokedex.id
  datalist_pokedex.replaceWith(new_datalist)
  datalist_pokedex = new_datalist
  
  for (var i = 0; i < pokedex.length; i++) {
    const option = document.createElement("option")
    option.value = pokedex[i].name
    datalist_pokedex.appendChild(option)
  }

  console.log("Pokedex datalist loaded !")
}

// Saves
function save_data() {
  const string_data = JSON.stringify(runs)
  localStorage.setItem(key_runs, string_data)

  console.log("Data saved locally !")

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
  console.log("get_pokemon_data(name = '", name, "') | return : ")
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
  const pokemon1 = pokedex[encounter.pokemon_1]
  const pokemon2 = pokedex[encounter.pokemon_2]
  if (pokemon1.species == pokemon2.species) {
    alert("Both pokemons share the same species !")   
    return false
  }
  if (is_pokemon_dupe(pokemon1, encounter.idx)) {
    alert("Pokemon 1 is a dupe !")
    return false
  }
  if (is_pokemon_dupe(pokemon2, encounter.idx)) {
    alert("Pokemon 2 is a dupe !")    
    return false
  }
  if (pokemon1.type1 == pokemon2.type1) {
    alert("Both pokemons share the same type 1 !")   
    return false
  }
  
  return true
}

function is_pokemon_dupe(pokemon_, encounter_idx = -1) {
  for (let i = 0; i < runs[current_run_id].encounters.length; i++) {
    const pokemon1 = pokedex[runs[current_run_id].encounters[i].pokemon_1]
    const pokemon2 = pokedex[runs[current_run_id].encounters[i].pokemon_2]
    if (i != encounter_idx) {
      if (pokemon1.species == pokemon_.species || pokemon2.species == pokemon_.species) {
        return true
      }
    } else {
      if (pokemon1.species == pokemon_.species && pokemon2.species == pokemon_.species) {
        return true
      }
    }
  }
  return false
}

function check_encounter_location(encounter) {  
  for (let i = 0; i < runs[current_run_id].encounters.length; i++) {
    if (encounter.idx != i && encounter.location == runs[current_run_id].encounters[i].location) {
      return false
    }
  }
  return true
}

function check_encounter_name(encounter) {  
  for (let i = 0; i < runs[current_run_id].encounters.length; i++) {
    if (encounter.idx != i && encounter.name == runs[current_run_id].encounters[i].name) {
      return false
    }
  }
  return true
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
  new_run.teams = []

  runs.push(new_run)

  load_run(new_run.idx)
  save_data()
  close_all_pop_ups()
  tab_encounters.click()
}



function load_run(idx) {
  save_data()
  
  for (var i = 0; i < runs.length; i++) {
    runs[i].is_active = false
  }
    
  runs[idx].is_active = true
  current_run_id = idx

  tab_encounters.disabled = false
  tab_teams.disabled = false
  
  load_menu()
  load_pokedex()
}

function load_pokedex() {
  console.log(runs[current_run_id].pokedex_key)
  fetch(app_url + generation_data_url + runs[current_run_id].pokedex_key + ".json")
    .then(response => response.json())
    .then(function(pokedex_fetched) {
        update_pokedex(pokedex_fetched)
        load_datalist_pokedex()
      })
}

function update_pokedex(value){
  pokedex = value
  console.log("Pokedex has been fully loaded !")
  console.log(pokedex)

  load_current_run_display()
  render_encounters()
  render_teams()
}


/*********************************************************************
*  Load runs pop-up functions
*********************************************************************/
function open_runs_pop_up() {
  return
}

function close_runs_pop_up() {
  return
}

/*********************************************************************
*  Encounters tab functions
*********************************************************************/
function render_encounters() {
  encounters_div.innerHTML = null;
  
  if (runs[current_run_id].encounters.length == 0) {
    console.log("render_encounters(): No encounters for this run !")
    return
  }

  // Reset datalist for teams tab's filters
  encounters_pokemons_datalist.innerHTML = null
  pokemon_pool = []

  console.log("render_encounters(): Starting to render the " + runs[current_run_id].encounters.length + " encounter(s)...")
  
  for (let idx = 0; idx < runs[current_run_id].encounters.length; idx++) {
    const container = document.createElement("div")
    container.className = encounter_class

    if (!runs[current_run_id].encounters[idx].alive) {
      container.style.background = "#555555";
    }
    
    // encounter info content
    const encounter_infos = document.createElement("div")
    encounter_infos.className = encounter_class + "infos"
    
    const encounter_location_p = document.createElement("p")
    const location_text = document.createTextNode(runs[current_run_id].encounters[idx].location)
    encounter_location_p.appendChild(location_text)
    encounter_location_p.className = encounter_class + "location"
    
    const encounter_name_p = document.createElement("p")
    const name_text = document.createTextNode(runs[current_run_id].encounters[idx].name)
    encounter_name_p.appendChild(name_text)
    encounter_name_p.className = encounter_class + "name"

    encounter_infos.appendChild(encounter_location_p)
    encounter_infos.appendChild(encounter_name_p)
    
    const pokemon1 = pokedex[runs[current_run_id].encounters[idx].pokemon_1]
    const pokemon2 = pokedex[runs[current_run_id].encounters[idx].pokemon_2]

    // pokemon 1 div content
    
    const pokemon_1 = document.createElement("div")
    pokemon_1.className = encounter_pokemon_class

    const img_pokemon1 = document.createElement("img")
    img_pokemon1.src = pokemon1.sprite
    img_pokemon1.className = encounter_pokemon_class + "_img"

    const div_pokemon1_types = document.createElement("div")
    div_pokemon1_types.className = encounter_class + "div_types"
    
    const img_pokemon1_type1 = document.createElement("img")
    img_pokemon1_type1.src = types_location + pokemon1.type1 + types_format
    img_pokemon1_type1.className = encounter_pokemon_class + "_type"

    const img_pokemon1_type2 = document.createElement("img")
    img_pokemon1_type2.src = types_location + pokemon1.type2 + types_format
    img_pokemon1_type2.className = encounter_pokemon_class + "_type"

    pokemon_1.appendChild(img_pokemon1)
    div_pokemon1_types.appendChild(img_pokemon1_type1)
    div_pokemon1_types.appendChild(img_pokemon1_type2)
    pokemon_1.appendChild(div_pokemon1_types)

    // pokemon 2 div content
    const pokemon_2 = document.createElement("div")
    pokemon_2.className = encounter_pokemon_class

    const img_pokemon2 = document.createElement("img")
    img_pokemon2.src = pokemon2.sprite
    img_pokemon2.className = encounter_pokemon_class + "_img"

    const div_pokemon2_types = document.createElement("div")
    div_pokemon2_types.className = encounter_class + "div_types"
    
    const img_pokemon2_type1 = document.createElement("img")
    img_pokemon2_type1.src = types_location + pokemon2.type1 + types_format
    img_pokemon2_type1.className = encounter_pokemon_class + "_type"

    const img_pokemon2_type2 = document.createElement("img")
    img_pokemon2_type2.src = types_location + pokemon2.type2 + types_format
    img_pokemon2_type2.className = encounter_pokemon_class + "_type"
    
    pokemon_2.appendChild(img_pokemon2)
    div_pokemon2_types.appendChild(img_pokemon2_type1)
    div_pokemon2_types.appendChild(img_pokemon2_type2)
    pokemon_2.appendChild(div_pokemon2_types)
    
    // encounter buttons/options
    const div_buttons = document.createElement("div")
    div_buttons.className = encounter_class + "div_buttons"
    
    const button_edit = document.createElement("button")
    button_edit.textContent = "edit"
    button_edit.onclick = () => open_encounter_pop_up(idx)
    button_edit.className = encounter_class + "buttons"

    const button_toggle_state = document.createElement("button")
    button_toggle_state.onclick = () => toggle_encounter_state(idx)
    button_toggle_state.className = encounter_class + "buttons"

    if (runs[current_run_id].encounters[idx].alive) {    
      button_toggle_state.textContent = "kill"

      // filter options for teams tab 
      const option_1 = document.createElement("option")
      option_1.value = pokemon1.name
      encounters_pokemons_datalist.appendChild(option_1)
      pokemon_pool.push(pokemon1.index)

      const option_2 = document.createElement("option")
      option_2.value = pokemon2.name
      encounters_pokemons_datalist.appendChild(option_2)
      pokemon_pool.push(pokemon2.index)
    } else {
      button_toggle_state.textContent = "revive"
    }
    
    

    container.appendChild(encounter_infos)
    container.appendChild(pokemon_1)
    container.appendChild(pokemon_2)
    div_buttons.appendChild(button_edit)
    div_buttons.appendChild(button_toggle_state)
    container.appendChild(div_buttons)
    
    encounters_div.appendChild(container)
  }
}

function toggle_encounter_state(idx = null, state = null) {
  if (idx == null) {
    return
  }

  if (idx < 0 || idx >= runs[current_run_id].encounters.length){
    return
  }

  if (typeof state != "boolean") {
    runs[current_run_id].encounters[idx].alive = !runs[current_run_id].encounters[idx].alive
  } else {
    runs[current_run_id].encounters[idx].alive = state
  }
  
  save_data()
  render_encounters()
  render_teams()
}

/*********************************************************************
*  Encounter pop-up functions
*********************************************************************/
function open_encounter_pop_up(idx = -1) {
  console.log("open_encounter_pop_up(idx = " + idx.toString() + ")")
  
  if (idx < 0) {
    pop_up_encounter_object = Object.create(encounter)
    pop_up_encounter_object.pokemon_1 = null
    pop_up_encounter_object.pokemon_2 = null
    pop_up_encounter_object.location = ""
    pop_up_encounter_object.alive = true
    pop_up_encounter_object.idx = -1
    pop_up_encounter_object.name = ""
    render_encounter_pop_up()    
  } else {
    pop_up_encounter_object = runs[current_run_id].encounters[idx]
    render_encounter_pop_up(pop_up_encounter_object)   
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
    render_pokemon_1(pokedex[encounter.pokemon_1])
    render_pokemon_2(pokedex[encounter.pokemon_2])
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
    pop_up_encounter_pokemon2.value = _pokemon.name
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
  runs[current_run_id].encounters.splice(idx, 1)
  render_encounters()
  save_data()
}

function edit_encounter(idx) {
  encounters[idx] = document.getElementById(encounter_id + idx.toString() + "_input").value
}

function save_encounter() {
  console.log("save_encounter(): Checking data for encounter : ")
  console.log(pop_up_encounter_object)
  
  // check data
  if (pop_up_encounter_object.location == "") {
    alert("Must enter a location name !")
    return
  }
  
  if (!check_encounter_location(pop_up_encounter_object)) {
    alert("You need to chose a unique location !")
    return
  }

  if (!check_encounter_name(pop_up_encounter_object)) {
    alert("You need to chose a unique nickname !")
    return
  }

  if (get_pokemon_data(pop_up_encounter_pokemon1.value) == null) {
    alert("Pokemon 1 isn't in the dex !")
    return
  }

  if (get_pokemon_data(pop_up_encounter_pokemon2.value) == null) {
    alert("Pokemon 2 isn't in the dex !")
    return
  }

  if (!is_encounter_valid(pop_up_encounter_object)) {
    return
  }

  console.log("save_encounter(): Data is correct.")

  let is_new_encounter = false
  
  // add encounter
  if (pop_up_encounter_object.idx < 0) {
    is_new_encounter = true
    pop_up_encounter_object.idx = runs[current_run_id].encounters.length
    runs[current_run_id].encounters.push(pop_up_encounter_object)
    console.log("save_encounter(): Encounter added as a new encounter with idx = " + pop_up_encounter_object.idx.toString() + " !")
  } else {
    runs[current_run_id].encounters[pop_up_encounter_object.idx] = pop_up_encounter_object
    console.log("save_encounter(): Encounter idx = " + pop_up_encounter_object.idx.toString() + " updated !")
  }

  // updates teams
  update_teams(pop_up_encounter_object.idx, is_new_encounter)
  
  // save data
  save_data()

  // render encounters
  render_encounters()
  
  // close pop-up
  toggle_pop_up()
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
    pop_up_encounter_object.pokemon_1 = new_pokemon.index
  }
})

pop_up_encounter_pokemon2.addEventListener('input', function (evt) {
  const new_pokemon = get_pokemon_data(pop_up_encounter_pokemon2.value)
  
  if (new_pokemon != null) {
      render_pokemon_2(new_pokemon)
      pop_up_encounter_object.pokemon_2 = new_pokemon.index
  }
})

/*********************************************************************
*  Teams tab functions
*********************************************************************/
function update_teams(encounter_idx, is_new) {
  console.log("update_teams(): with encounter = ")
  console.log(runs[current_run_id].encounters[encounter_idx])

  // if encounter IS NEW copy all teams that are not max size and add new encounter to it
  if (!is_new) {
    console.log("update_teams(): old encounter... delete all related teams")

    for (let i = runs[current_run_id].teams.length-1; i >= 0; i--){
      if (runs[current_run_id].teams[i].indexOf(encounter_idx) >= 0){
          runs[current_run_id].teams.pop(i)
      }
    }
  }
  
  
  for (let i = runs[current_run_id].teams.length-1; i >= 0; i--) {
    if (runs[current_run_id].teams[i].length < team_size_max) {
      let new_team = []
      runs[current_run_id].teams[i].forEach(element => {
        new_team.push(element)
      })

      new_team.push(encounter_idx)
        
      if (is_team_legal(new_team)){
        runs[current_run_id].teams.push(new_team)
      }        
    }
  }
    
  // New encounter is always a team of 1
  runs[current_run_id].teams.push([encounter_idx])
    
  // render teams tab
  save_data()
  render_teams()
}

function is_team_legal(team){
  let types_array = []

  for (idx = 0; idx < team.length; idx++){
    const pokemon1 = pokedex[runs[current_run_id].encounters[team[idx]].pokemon_1]
    const pokemon2 = pokedex[runs[current_run_id].encounters[team[idx]].pokemon_2]
    if (types_array.indexOf(pokemon1.type1) > -1) {
      return false
    } else {
      types_array.push(pokemon1.type1)
    }
    if (types_array.indexOf(pokemon2.type1) > -1) {
      return false
    } else {
      types_array.push(pokemon2.type1)
    }
  }

  return true
}

function is_team_alive(team){
  for (idx = 0; idx < team.length; idx++){
    const pokemon1 = pokedex[runs[current_run_id].encounters[team[idx]].pokemon_1]
    const pokemon2 = pokedex[runs[current_run_id].encounters[team[idx]].pokemon_2]
    if (!runs[current_run_id].encounters[team[idx]].alive){
      return false
    }
  }
  return true
}

function is_team_in_filter(team){
  let count_filters = 0

  for (idx = 0; idx < team.length; idx++){
    if (filters_array.indexOf(runs[current_run_id].encounters[team[idx]].pokemon_1) > -1) {
      count_filters++
    } 
    if (filters_array.indexOf(runs[current_run_id].encounters[team[idx]].pokemon_2) > -1) {
      count_filters++
    }
  }

  return count_filters == filters_array.length
}

function build_filter_array(){
  filters_array = []

  for (let i = 0; i < teams_filter_array.length; i++){
    const filter_pokemon = get_pokemon_data(teams_filter_array[i].value)
    if (filter_pokemon != null){
      if (pokemon_pool.indexOf(filter_pokemon.index) > -1){
        filters_array.push(filter_pokemon.index)
      } else {
      teams_filter_array[i].value = ""
      }
    } else {
      teams_filter_array[i].value = ""
    }
  }
  
  render_teams()
}

function render_teams() {
  
  // first reset the page content
  teams_div_array.forEach(element => {
    element.innerHTML = null;
  })

  // Check if any teams
  if (runs[current_run_id].teams.length == 0) {
    console.log("render_teams(): No teams available for this run !")
    return
  }

  console.log("render_teams(): Starting to render the " + runs[current_run_id].teams.length + " team(s)...")
  console.log(runs[current_run_id].teams)
  
  for (let idx = 0; idx < runs[current_run_id].teams.length; idx++) {
    if (is_team_legal(runs[current_run_id].teams[idx]) && is_team_in_filter(runs[current_run_id].teams[idx]) && is_team_alive(runs[current_run_id].teams[idx])) {

      const container = document.createElement("div")
      container.className = team_class
      
      // players div
      const div_player_1 = document.createElement("div")
      div_player_1.className = team_class + "player_1"

      const div_player_1_infos = document.createElement("div")
      div_player_1_infos.className = team_class + "player_infos"
      div_player_1_infos.textContent = runs[current_run_id].player_1

      const div_player_2 = document.createElement("div")
      div_player_2.className = team_class + "player_2"

      const div_player_2_infos = document.createElement("div")
      div_player_2_infos.className = team_class + "player_infos"
      div_player_2_infos.textContent = runs[current_run_id].player_2

      div_player_1.appendChild(div_player_1_infos)
      div_player_2.appendChild(div_player_2_infos)
      
      // adding pokemons to players div
      for (let i = 0; i < runs[current_run_id].teams[idx].length; i++) {
        const pokemon1 = pokedex[runs[current_run_id].encounters[runs[current_run_id].teams[idx][i]].pokemon_1]
        const pokemon2 = pokedex[runs[current_run_id].encounters[runs[current_run_id].teams[idx][i]].pokemon_2]
        // player 1
        const pokemon_player_1 = document.createElement("div")
        pokemon_player_1.className = team_pokemon_class

        const img_pokemon1 = document.createElement("img")
        img_pokemon1.src = pokemon1.sprite
        img_pokemon1.className = team_pokemon_class + "_img"

        // player 2
        const pokemon_player_2 = document.createElement("div")
        pokemon_player_2.className = team_pokemon_class

        const img_pokemon2 = document.createElement("img")
        img_pokemon2.src = pokemon2.sprite
        img_pokemon2.className = team_pokemon_class + "_img"

        pokemon_player_1.appendChild(img_pokemon1)
        pokemon_player_2.appendChild(img_pokemon2)
        div_player_1.appendChild(pokemon_player_1)
        div_player_2.appendChild(pokemon_player_2)
      }
      
      container.appendChild(div_player_1)
      container.appendChild(div_player_2)
      
      teams_div_array[runs[current_run_id].teams[idx].length-1].appendChild(container)
    }
  }
  console.log(document.getElementsByClassName(team_class).length)
}

function are_encounters_alive(team){
  console.log(team)
  for (let i = 0; i < team.length; i++){
    if (!runs[current_run_id].encounters[team[i].idx].alive){
      return false
    }
  }

  return true
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
  //current_run_id = 1
  if (current_run_id == -1) {
    tab_encounters.disabled = true
    tab_teams.disabled = true   
  } else {
    load_run(current_run_id)
  }

  // prepare tabs
  tab_menu.click()
  
}

// Pop-up management
function toggle_pop_up(target = null) {
  close_all_pop_ups()

  if (target != null) {
    pop_up.style.display = "block"
    target.style.display = "block"
  }
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

// loading page
document.addEventListener("DOMContentLoaded", load_page)
