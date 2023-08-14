import { render, replace, remove } from '../framework/render.js';
import BoardView from '../view/board-view.js';
import TaskListView from '../view/task-list-view.js';
import SortView from '../view/sort-view.js';
import TaskEditView from '../view/task-edit-view.js';
import TaskView from '../view/task-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NoTaskView from '../view/no-task-view.js';


const TASK_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  #boardContainer = null;
  #tasksModel = null;

  #boardComponent = new BoardView();
  #taskListComponent = new TaskListView();
  #loadMoreButtonComponent = null;

  #boardTasks = [];
  #renderedTaskCount = TASK_COUNT_PER_STEP;


  constructor({boardContainer, taskModel}) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = taskModel;
  }

  init() {
    this.#boardTasks = [...this.#tasksModel.tasks];

    this.#renderBoard();
  }

  #handleLoadMoreButtonClick = () => {
    this.#boardTasks
      .slice(this.#renderedTaskCount, this.#renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => this.#renderTask(task));
    this.#renderedTaskCount += TASK_COUNT_PER_STEP;

    if(this.#renderedTaskCount > this.#boardTasks.length) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #renderTask(task) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const taskComponent = new TaskView({
      task,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('click', escKeyDownHandler);
      }
    });

    const taskEditComponent = new TaskEditView({
      task,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('click', escKeyDownHandler);
      }
    });

    function replaceCardToForm() {
      replace(taskEditComponent, taskComponent);
    }

    function replaceFormToCard() {
      replace(taskComponent, taskEditComponent);
    }

    render(taskComponent, this.#taskListComponent.element);
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    if (this.#boardTasks.every((task) => task.isArchive)) {
      render(new NoTaskView(), this.#boardComponent.element);
      return;
    }

    render(new SortView(), this.#boardComponent.element);
    render(this.#taskListComponent, this.#boardComponent.element);
    // render(new TaskEditView({task: this.#boardTasks[0]}), this.#taskListComponent.element);

    for (let i = 0; i < Math.min(this.#boardTasks.length, this.#renderedTaskCount); i++) {
      this.#renderTask(this.#boardTasks[i]);
    }

    if(this.#boardTasks.length > TASK_COUNT_PER_STEP) {
      this.#loadMoreButtonComponent = new LoadMoreButtonView({
        onClick: this.#handleLoadMoreButtonClick
      });
      render(this.#loadMoreButtonComponent, this.#boardComponent.element);
    }
  }
}
