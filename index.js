let encounters = ["ditto", "pikachu"];


const encouters_div = document.getElementById("encouters")

function load_encounters() {}

function render_encounters() {
  encouters_div.innerHTML = null;

  for (const [idx, item] of Object.entries(items)) {
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

