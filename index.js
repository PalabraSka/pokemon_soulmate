let runs = []
let encounters = []
let pokedex = []

const run = {
  idx: -1,
  name: "",
  is_active: true,
  generation: "",
  pokedex: "",
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

function open_runs_pop_up() {
  return
}

function close_runs_pop_up() {
  return
}

function load_run() {
  return
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
*  Main page functions
*********************************************************************/
function load_page() {
  // load data
  load_runs()
  
  // close pop-ups
  close_all_pop_ups()

  // load tabs content
  load_menu()

  // prepare tabs
  tab_menu.click()
  tab_encounters.disabled = true
  tab_teams.disabled = true 
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
