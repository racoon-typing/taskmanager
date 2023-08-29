import {remove, render, replace} from '../framework/render.js';
import TaskView from '../view/task-view.js';
import TaskEditView from '../view/task-edit-view.js';

export default class TaskPresenter {
  #taskListContainer = null;
  #handleDataChange = null;

  #taskComponent = null;
  #taskEditComponent = null;

  #task = null;

  constructor({taskListContainer, onDataChange}) {
    this.#taskListContainer = taskListContainer;
    this.#handleDataChange = onDataChange;
  }

  init(task) {
    this.#task = task;

    const prevTaskComponent = this.#taskComponent;
    const prevTaskEditComponent = this.#taskEditComponent;

    this.#taskComponent = new TaskView({
      task: this.#task,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleArchiveClick,
      onArchiveClick: this.#handleArchiveClick
    });
    this.#taskEditComponent = new TaskEditView({
      task: this.#task,
      onFormSubmit: this.#handleFormSubmit,
    });

    if (prevTaskComponent === null || prevTaskEditComponent === null) {
      render(this.#taskComponent, this.#taskListContainer);
      return;
    }

    if (this.#taskListContainer.contains(prevTaskComponent.element)) {
      replace(this.#taskComponent, prevTaskComponent);
    }

    if (this.#taskListContainer.contains(prevTaskEditComponent.element)) {
      replace(this.#taskEditComponent, prevTaskEditComponent);
    }

    remove(prevTaskComponent);
    remove(prevTaskEditComponent);
  }

  destroy() {
    remove(this.#taskComponent);
    remove(this.#taskEditComponent);
  }

  #replaceCardToForm() {
    replace(this.#taskEditComponent, this.#taskComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceFormToCard() {
    replace(this.#taskComponent, this.#taskEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToCard();
    }
  };

  #handleArchiveClick = () => {
    this.#handleDataChange({...this.#task, isFavorite: !this.#task.isFavorite});
  };

  // #handleFavoriteClick = () => {

  // }


  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToCard();
  };
}
