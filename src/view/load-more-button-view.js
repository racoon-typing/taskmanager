import { createElement } from '../render.js';

function createLoadMoreButtonView() {
  return '<button class="load-more" type="button">load more</button>';
}

export default class LoadMoreButtonView {
  getTemplate() {
    return createLoadMoreButtonView();
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
