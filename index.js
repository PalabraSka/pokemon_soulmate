let encounters = [];


const encounters_div = document.getElementById("encounters_div")
const encounter_name = document.getElementById("encounter_name")
const encounters_key = "encounters"
const encounter_id = "encounter_"


function load_encounters() {
  const old_encounters = localStorage.getItem(encounters_key)
  if (old_encounters) {
    encounters = JSON.parse(old_encounters)
    render_encounters()
  }
}

function render_encounters() {
  encounters_div.innerHTML = null;

  for (const [idx, item] of Object.entries(encounters)) {
    const container = document.createElement("div")
    container.style.marginBottom = "10px"
    container.id = encounter_id + toString(idx)
    
    //const text = document.createElement("input")
    //text.textContent = item
    //text.style.display = "inline"
    //text.style.marginRight = "10px"

    const input = document.createElement("input")
    input.type = "text"
    input.id = encounter_id + toString(idx) + "_input"
    input.placeholder = item
    input.style.display = "inline"
    input.style.marginRight = "20px"

    const button_edit = document.createElement("button")
    button_edit.textContent = "edit"
    button_edit.onclick = () => edit_encounter(idx)
    
    const button_del = document.createElement("button")
    button_del.textContent = "delete"
    button_del.onclick = () => remove_encounter(idx)

    container.appendChild(text)
    container.appendChild(button_edit)
    container.appendChild(button_del)
    
    encounters_div.appendChild(container)
  }
}

function save_encounters() {
  const string_encounters = JSON.stringify(encounters)

  localStorage.setItem(encounters_key, string_encounters)
}

function add_encounter() {
  const value = encounter_name.value;

  if (!value) {
    alert("Not a pokemon !")
    return
  }

  encounters.push(value)
  render_encounters()
  save_encounters()
  encounter_name.value = ""
}

function remove_encounter(idx) {
  encounters.splice(idx, 1)
  render_encounters()
  save_encounters()
}

function edit_encounter(idx) {
  encounters[idx] = document.getElementById(encounter_id + toString(idx) + "_input").value
}

function save_encounter(idx) {}

function reset_encouters() {
  encounters = []
  render_encounters()
}


// loading
document.addEventListener("DOMContentLoaded", load_encounters)
