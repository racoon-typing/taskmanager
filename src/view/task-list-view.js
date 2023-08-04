import { createElement } from '../render.js';

function createTaskListViewTemplate() {
  return '<div class="board__tasks"></div>';
}

export default class TaskListView {
  getTemplate() {
    return createTaskListViewTemplate();
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
