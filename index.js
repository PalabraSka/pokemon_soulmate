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
  if (encounter.pokemon_1.species == encounter.pokemon_2.species) {
    alert("Both pokemons share the same species !")   
    return false
  }
  if (is_pokemon_dupe(encounter.pokemon_1, encounter.idx)) {
    alert("Pokemon 1 is a dupe !")
    return false
  }
  if (is_pokemon_dupe(encounter.pokemon_2, encounter.idx)) {
    alert("Pokemon 2 is a dupe !")    
    return false
  }
  if (encounter.pokemon_1.type1 == encounter.pokemon_2.type1) {
    alert("Both pokemons share the same type 1 !")   
    return false
  }
  
  return true
}

function is_pokemon_dupe(pokemon_, encounter_idx = -1) {
  for (let i = 0; i < runs[current_run_id].encounters.length; i++) {
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

  runs.push(new_run)

  load_run(new_run.idx)
  save_data()
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
  load_current_run_display()
  render_encounters()
  build_tab_teams()
  
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
  
  if (runs[current_run_id].encounters.length == 0) {
    console.log("render_encounters(): No encounters for this run !")
    return
  }

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
    
    // pokemon 1 div content
    const pokemon_1 = document.createElement("div")
    pokemon_1.className = encounter_pokemon_class

    const img_pokemon1 = document.createElement("img")
    img_pokemon1.src = runs[current_run_id].encounters[idx].pokemon_1.sprite
    img_pokemon1.className = encounter_pokemon_class + "_img"

    const div_pokemon1_types = document.createElement("div")
    div_pokemon1_types.className = encounter_class + "div_types"
    
    const img_pokemon1_type1 = document.createElement("img")
    img_pokemon1_type1.src = types_location + runs[current_run_id].encounters[idx].pokemon_1.type1 + types_format
    img_pokemon1_type1.className = encounter_pokemon_class + "_type"

    const img_pokemon1_type2 = document.createElement("img")
    img_pokemon1_type2.src = types_location + runs[current_run_id].encounters[idx].pokemon_1.type2 + types_format
    img_pokemon1_type2.className = encounter_pokemon_class + "_type"

    pokemon_1.appendChild(img_pokemon1)
    div_pokemon1_types.appendChild(img_pokemon1_type1)
    div_pokemon1_types.appendChild(img_pokemon1_type2)
    pokemon_1.appendChild(div_pokemon1_types)

    // pokemon 2 div content
    const pokemon_2 = document.createElement("div")
    pokemon_2.className = encounter_pokemon_class

    const img_pokemon2 = document.createElement("img")
    img_pokemon2.src = runs[current_run_id].encounters[idx].pokemon_2.sprite
    img_pokemon2.className = encounter_pokemon_class + "_img"

    const div_pokemon2_types = document.createElement("div")
    div_pokemon2_types.className = encounter_class + "div_types"
    
    const img_pokemon2_type1 = document.createElement("img")
    img_pokemon2_type1.src = types_location + runs[current_run_id].encounters[idx].pokemon_2.type1 + types_format
    img_pokemon2_type1.className = encounter_pokemon_class + "_type"

    const img_pokemon2_type2 = document.createElement("img")
    img_pokemon2_type2.src = types_location + runs[current_run_id].encounters[idx].pokemon_2.type2 + types_format
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
  
  render_encounters()
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
  encounters[idx] = document.getElementById(encounter_id + toString(idx) + "_input").value
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
  
  // add encounter
  if (pop_up_encounter_object.idx < 0) {
    pop_up_encounter_object.idx = runs[current_run_id].encounters.length
    runs[current_run_id].encounters.push(pop_up_encounter_object)
    console.log("save_encounter(): Encounter added as a new encounter with idx = " + pop_up_encounter_object.idx.toString() + " !")
  } else {
    runs[current_run_id].encounters[pop_up_encounter_object.idx] = pop_up_encounter_object
    console.log("save_encounter(): Encounter idx = " + pop_up_encounter_object.idx.toString() + " updated !")
  }

  // save data
  save_data()

  // render encounters
  render_encounters()

  // build teams
  build_tab_teams()
  
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
function build_tab_teams() {
  let encounters_array = runs[current_run_id].encounters

  console.log("build_tab_teams(): Prepare team building algorithm")
  
  // clear dead encounters if any
  for (let i = encounters_array.length-1; i >= 0; i--) {
    if (!encounters_array[i].alive) {
      encounters_array.pop(i)
    }
  }

  // if no team, skip the rest of the function
  if (encounters_array.length == 0) {
    console.log("build_tab_teams(): No encounters found. Can't generate teams.")
    render_teams()
    return
  }

  // Since there are some encounters... We can proceed to build teams
  let teams_array = []
  let team_size_max_adjusted = encounters_array.length

  if (encounters_array.length > team_size_max) {
    team_size_max_adjusted = team_size_max
  }
  
  for (let i = 1; i <= team_size_max_adjusted; i++) {
    console.log("build_tab_teams(): Start building teams of " + i.toString() + " pokemon(s).")
    let encounters_array_temp = encounters_array
    while (encounters_array_temp.length > 0) {
      teams_array.concat(generate_teams(encounters_array_temp, i))
      encounters_array_temp.pop()
    }
  }

  
  
  console.log(teams_array)
}

function generate_teams(encounters_array = [], teams_size = team_size_max, current_team = []) {
  let teams_array = []
  
  current_team.push(encounters_array.pop())

  if (current_team.length == team_size) {
    teams_array.push(current_team)
    console.log(teams_array)
    return teams_array
  }
  
  for (idx = 0; idx < encounters_array.length; idx++) {
      teams_array.push(current_team.concat(generate_teams(encounters_array, teams_size, current_team)))
  }

  return teams_array
}

function render_teams(teams = []) {
  const teams_array = []

  if (teams_array == null) {
    return
  }
  
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
  current_run_id = 1
  if (current_run_id == -1) {
    tab_encounters.disabled = true
    tab_teams.disabled = true   
  } else {
    load_run(current_run_id)
    build_tab_teams()
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

  console.log("build_pokedex(generation = '" + generation + "')")
  
  pokedex = []
  const nb_species = count_species(generation)
  dex_size = nb_species

  fetch(api_url + "/pokemon?limit=" + nb_species.toString())
    .then(response => response.json())
    .then(function(allpokemon) {
      //console.log(allpokemon.results)
      allpokemon.results.forEach(function(pokemon) {
        fetch_pokemon_data(pokemon, generation)
      })
    })
  
  check_dex_size(generation)
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

// loading page
document.addEventListener("DOMContentLoaded", load_page)
