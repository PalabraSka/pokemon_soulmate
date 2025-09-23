import generation_i from "static/data/generation-i.json" with { type: "json" }
import generation_ii from "static/data/generation-ii.json" with { type: "json" }
import generation_iii from "static/data/generation-iii.json" with { type: "json" }
import generation_iv from "static/data/generation-iv.json" with { type: "json" }
import generation_v from "static/data/generation-v.json" with { type: "json" }
import generation_vi from "static/data/generation-vi.json" with { type: "json" }
import generation_vii from "static/data/generation-vii.json" with { type: "json" }
import generation_viii from "static/data/generation-viii.json" with { type: "json" }
import generation_ix from "static/data/generation-ix.json" with { type: "json" }

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
  sprite: "",
  species: "",
  type1: null,
  type2: null
}

const encounter = {
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
const datalist_generations = document.getElementById("datalist_generations")
const datalist_pokedex = document.getElementById("datalist_pokedex")

/* flat data */
const generations_array = ["generation-i", "generation-ii", "generation-iii", "generation-iv", "generation-v", "generation-vi", "generation-vii", "generation-viii", "generation-ix"]
const pokedex_array = {
  "generation-i": generation_i,
  "generation-ii": generation_ii,
  "generation-iii": generation_iii,
  "generation-iv": generation_iv,
  "generation-v": generation_v,
  "generation-vi": generation_vi,
  "generation-vii": generation_vii,
  "generation-viii": generation_viii,
  "generation-ix": generation_ix
}

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

function load_datalist_generations() {
  for (var i = 0; i < generations_array.length; i++) {
    const option = document.createElement("option")
    option.value = generations_array[i]
    datalist_generations.appendChild(option)
  }
}

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

function get_generation_index(generation) {
  if (generations_array.include(generation) {
    return generations_array.indexOf(generation)
  } else {
    return -1
  }
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

function load_pokedex(){
  pokedex = pokedex_array[runs[current_run_id].pokedex_key
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

// Load and save data
function save_encounters() {
  const string_encounters = JSON.stringify(encounters)

  localStorage.setItem(encounters_key, string_encounters)
}

function load_encounters() {
  const old_encounters = localStorage.getItem(encounters_key)
  if (old_encounters) {
    encounters = JSON.parse(old_encounters)
    render_encounters()
  }
}

function reset_encouters() {
  encounters = []
  render_encounters()
}

// New encounter / edit / remove encounter process
function open_encounter_pop_up(idx = -1) {
  if (idx < 0) {
    pop_up.style.display = "block"
    pop_up_encounter.style.display = "block"
  }
  pop_up.style.display = "block"
  pop_up_encounter.style.display = "block"
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

// loading page
document.addEventListener("DOMContentLoaded", load_page)
