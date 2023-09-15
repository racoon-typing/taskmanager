import { render, RenderPosition, remove } from '../framework/render.js';
import BoardView from '../view/board-view.js';
import TaskListView from '../view/task-list-view.js';
import SortView from '../view/sort-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import NoTaskView from '../view/no-task-view.js';
import TaskPresenter from './task-presenter.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { sortTaskDown, sortTaskUp } from '../utils/task.js';


const TASK_COUNT_PER_STEP = 8;

export default class BoardPresenter {
  #boardContainer = null;
  #tasksModel = null;

  #boardComponent = new BoardView();
  #taskListComponent = new TaskListView();
  #loadMoreButtonComponent = null;
  #sortComponent = null;
  #noTaskComponent = new NoTaskView();

  #renderedTaskCount = TASK_COUNT_PER_STEP;
  #taskPresenters = new Map();
  #currentSortType = SortType.DEFAULT;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;

    this.#tasksModel.addObserver(this.#handleModelEvent);
  }

  get tasks() {
    switch (this.#currentSortType) {
      case SortType.DATE_UP:
        return [...this.#tasksModel.tasks].sort(sortTaskUp);
      case SortType.DATE_DOWN:
        return [...this.#tasksModel.tasks].sort(sortTaskDown);
    }

    return this.#tasksModel.tasks;
  }

  init() {
    this.#renderBoard();
  }

  #handleLoadMoreButtonClick = () => {
    const taskCount = this.tasks.length;
    const newRenderedTaskCount = Math.min(taskCount, this.#renderedTaskCount + TASK_COUNT_PER_STEP);
    const tasks = this.tasks.slice(this.#renderedTaskCount, newRenderedTaskCount);

    this.#renderTasks(tasks);
    this.#renderedTaskCount = newRenderedTaskCount;

    if (this.#renderedTaskCount >= taskCount) {
      remove(this.#loadMoreButtonComponent);
    }
  };

  #handleModeChange = () => {
    this.#taskPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#tasksModel.updateTask(updateType, update);
        break;
      case UserAction.ADD_TASK:
        this.#tasksModel.addTask(updateType, update);
        break;
      case UserAction.DELETE_TASK:
        this.#tasksModel.deleteTask(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#taskPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetRenderedTaskCount: true, resetSortType: true });
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({ resetRenderedTaskCount: true });
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });

    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderTask(task) {
    const taskPresenter = new TaskPresenter({
      taskListContainer: this.#taskListComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    taskPresenter.init(task);
    this.#taskPresenters.set(task.id, taskPresenter);
  }

  #renderTasks(tasks) {
    tasks.forEach((task) => this.#renderTask(task));
  }

  #renderNoTasks() {
    render(this.#noTaskComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderLoadMoreButton() {
    this.#loadMoreButtonComponent = new LoadMoreButtonView({
      onClick: this.#handleLoadMoreButtonClick
    });
    render(this.#loadMoreButtonComponent, this.#boardComponent.element);
  }

  #clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const taskCount = this.tasks.length;

    this.#taskPresenters.forEach((presenter) => presenter.destroy());
    this.#taskPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#noTaskComponent);
    remove(this.#loadMoreButtonComponent);

    if (resetRenderedTaskCount) {
      this.#renderedTaskCount = TASK_COUNT_PER_STEP;
    } else {
      this.#renderedTaskCount = Math.min(taskCount, this.#renderedTaskCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    const tasks = this.tasks;
    const taskCount = tasks.length;

    if (taskCount === 0) {
      this.#renderNoTasks();
    }

    this.#renderSort();
    render(this.#taskListComponent, this.#boardComponent.element);

    this.#renderTasks(tasks.slice(0, Math.min(taskCount, this.#renderedTaskCount)));

    if (taskCount > this.#renderedTaskCount) {
      this.#renderLoadMoreButton();
    }
  }
}
