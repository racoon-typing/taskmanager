import BoardView from '../view/board-view.js';
import TaskListView from '../view/task-list-view.js';
import SortView from '../view/sort-view.js';
import TaskEditView from '../view/task-edit-view.js';
import TaskView from '../view/task-view.js';
import LoadMoreButtonView from '../view/load-more-button-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  boardComponent = new BoardView();
  taskListComponent = new TaskListView();

  constructor({boardContainer, taskModel}) {
    this.boardContainer = boardContainer;
    this.taskModel = taskModel;
  }

  init() {
    this.boardTasks = [...this.taskModel.getTasks()];

    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());
    render(this.taskListComponent, this.boardComponent.getElement());
    render(new TaskEditView({task: this.boardTasks[0]}), this.taskListComponent.getElement());

    for (let i = 1; i < this.boardTasks.length; i++) {
      render(new TaskView({task: this.boardTasks[i]}), this.taskListComponent.getElement());
    }

    render(new LoadMoreButtonView(), this.boardComponent.getElement());
  }
}
