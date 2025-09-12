let encounters = ["ditto", "pikachu"];


const encounters_div = document.getElementById("encounters_div")

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
    container.appendChild(button_del)
    
    encounters_div.appendChild(container)
  }
}

render_encounters()

function save_encounters() {}

function add_encounter() {}

function remove_encounter(idx) {}

function edit_encounter(idx) {}

function reset_encouters() {}

