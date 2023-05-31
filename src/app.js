export default class App {
  #items = [];

  constructor() {
    this.addInput = document.querySelector("#addInput");
    this.addButton = document.querySelector("#addButton");
    this.toDoList = document.querySelector("#list");

    this.#bindEvents();

    this.loadItems();
  }

  #bindEvents() {
    this.addButton.addEventListener("click", () => {
      this.addItem(this.addInput.value.trim());
      this.addInput.value = "";
    });
    window.addEventListener("keydown", (evt) => {
      if (evt.code === "Enter") {
        this.addItem(this.addInput.value.trim());
        this.addInput.value = "";
      }
    });
    this.toDoList.addEventListener("click", (evt) => {
      if (evt.target.dataset.removeItem) {
        this.removeItem(evt.target.dataset.removeItem);
      }
    });
    this.toDoList.addEventListener("change", (evt) => {
      const targetItemId = evt.target.dataset.itemId;
      if (targetItemId) {
        if (evt.target.checked) {
          this.markItemAsChecked(targetItemId);
        } else {
          this.markItemAsUnchecked(targetItemId);
        }
      }
    });
  }

  addItem(item) {
    if (!item) {
      return;
    }
    if (typeof item === "string") {
      item = {
        id: Date.now(),
        content: item,
        completed: false,
      };
    }

    this.#items.push(item);

    const element = this.createElForItem(item);

    this.toDoList.append(element);

    this.saveItems();
  }

  removeItem(id) {
    if (typeof id === "string") {
      id = Number(id);
    }

    const itemToDeleteIndex = this.#items.findIndex((item) => item.id === id);
    if (itemToDeleteIndex >= 0) {
      this.#items.splice(itemToDeleteIndex, 1);
    }

    const itemToDeleteEl = document.querySelector(`[data-item-id='${id}']`);
    if (itemToDeleteEl) {
      itemToDeleteEl.remove();
    }

    this.saveItems();
  }

  markItemAsChecked(id) {
    if (typeof id === "string") {
      id = Number(id);
    }

    const itemToCheck = this.#items.find((item) => item.id === id);
    if (itemToCheck) {
      console.log(itemToCheck);
      itemToCheck.completed = true;
      const itemToCheckEl = document.querySelector(`[data-item-id='${id}']`);
      if (itemToCheckEl) {
        itemToCheckEl.classList.add("item_done");
      }
    }

    this.saveItems();
  }

  markItemAsUnchecked(id) {
    if (typeof id === "string") {
      id = Number(id);
    }

    const itemToCheck = this.#items.find((item) => item.id === id);
    if (itemToCheck) {
      itemToCheck.completed = false;
      const itemToCheckEl = document.querySelector(`[data-item-id='${id}']`);
      if (itemToCheckEl) {
        itemToCheckEl.classList.remove("item_done");
      }
    }

    this.saveItems();
  }

  saveItems() {
    const data = JSON.stringify(this.#items);
    localStorage.setItem("items", data);
  }

  loadItems() {
    try {
      const data = localStorage.getItem("items");
      const items = JSON.parse(data);
      items.forEach((i) => this.addItem(i));
    } catch (e) {
      console.error("Wow, error!!!");
    }
  }

  createElForItem(item) {
    const element = document.createElement("div");

    element.classList.add("item");
    element.dataset.itemId = item.id;
    if (item.completed) {
      element.classList.add("item_done");
    }

    element.innerHTML = `
    <input type="checkbox" class="item-checkbox" data-item-id="${item.id}" ${
      item.completed ? "checked" : ""
    } />
    <div class="item-content">${item.content}</div>
    <button type="button" class="item-remove-button" data-remove-item="${
      item.id
    }">&times;</button>
    `;

    return element;
  }
}
