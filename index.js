let encounters = ["ditto", "pikachu"];


const encounters_div = document.getElementById("encounters_div")

function load_encounters() {}

function render_encounters() {
  encounters_div.innerHTML = null;

  for (const [idx, item] of Object.entries(encounters)) {
    const text = document.createElement("p")
    text.textContent = item;
    encounters_div.appendChild(text)
  }
}

render_encounters()

function save_encounters() {}

function add_encounter() {}

function remove_encounter() {}

function reset_encouters() {}

