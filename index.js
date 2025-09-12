let encounters = ["ditto", "pikachu"];


const encounters_div = document.getElementById("encounters_div")
const encounter_name = document.getElementById("encounter_name")

function load_encounters() {}

function render_encounters() {
  encounters_div.innerHTML = null;

  for (const [idx, item] of Object.entries(encounters)) {
    const container = document.createElement("div")
    container.style.marginBottom = "10px"
    
    const text = document.createElement("p")
    text.textContent = item
    text.style.display = "inline"
    text.style.marginRight = "10px"

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

render_encounters()

function save_encounters() {}

function add_encounter() {
  const value = encounter_name.value;

  if not(!value) {
    alert("Not a pokemon !")
    return
  }

  encounters.push(value)
  render_encounter()
  encounter_name.value = ""
}

function remove_encounter(idx) {
  encounters.splice(idx, 1)
  render_encounters()
}

function edit_encounter(idx) {}

function save_encounter(idx) {}

function reset_encouters() {
  encounters = []
  render_encounters()
}

