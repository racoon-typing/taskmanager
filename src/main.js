import { render } from './framework/render.js';
import NewTaskButtonView from './view/new-task-button-view';
import BoardPresenter from './presenter/board-presentor';
import FilterPresenter from './presenter/filter-presenter.js';
import TasksModel from './model/task-model.js';
import FilterModel from './model/filter-model.js';


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');
const tasksModel = new TasksModel();
const filterModel = new FilterModel();
const boardPresentor = new BoardPresenter({boardContainer: siteMainElement, tasksModel});
const filterPresenter = new FilterPresenter({
  filterContainer: siteMainElement,
  filterModel,
  tasksModel
});

render(new NewTaskButtonView(), siteHeaderElement);

filterPresenter.init();
boardPresentor.init();
