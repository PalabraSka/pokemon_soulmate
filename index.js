let encounters = []
let pokedex = []

const pokemon = {
  sprite: "",
  type1: null,
  type2: null
}

const encounter = {
  location: "",
  name: "",
  pokemon_1: Object.create(pokemon),
  pokemon_2: Object.create(pokemon)
}

const pop_up = document.getElementById("pop-up_main")
const pop_up_encounter = document.getElementById("pop-up_encounter")

const encounters_div = document.getElementById("encounters_div")
const encounter_name = document.getElementById("encounter_name")
const encounters_key = "encounters"
const encounter_id = "encounter_"
const encounter_class = "encounter"

const pokedex_key = "pokedex"
const pokedex_link = "https://pokeapi.co/api/v2/pokemon/"


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
    button_edit.onclick = () => edit_encounter(idx)
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

  pop_up.style.display = "none"
  pop_up_encounter.style.display = "none"
}

function reset_encouters() {
  encounters = []
  render_encounters()
}

// Load pokedex
function load_pokedex() {
  pokedex = localStorage.getItem(pokedex_key)
  
  if (pokedex) {
    return
  }
  
  const api_request = fetch(pokedex_link)
  
  if (!api_request.ok) {
    throw new Error('Failed to retrieve JSON at "https://pokeapi.co/". Response status : ${api_request.status}') 
  }
}

function update_pokedex() {
  const api_request
  const pokedex_gen_1 = []
  
  

  
  const pokedex_gen_2 = []
  const pokedex_gen_3 = []
  const pokedex_gen_4 = []
  const pokedex_gen_5 = []
  const pokedex_gen_6 = []
  const pokedex_gen_7 = []
  
}


// New encounter / edit / remove encounter process
function open_encounter(idx = -1) {
  if (idx < 0) {}
  pop_up.style.display = "block"
  pop_up_encounter.style.display = "block"
}

function close_encounter() {
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

// loading page
document.addEventListener("DOMContentLoaded", load_encounters)
