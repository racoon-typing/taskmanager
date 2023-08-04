import { createElement } from '../render.js';

function createBoardViewTemplate() {
  return '<section class="board container"></section>';
}

export default class BoardView {
  getTemplate() {
    return createBoardViewTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

