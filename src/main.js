import { render } from './framework/render.js';
import NewTaskButtonView from './view/new-task-button-view';
import BoardPresenter from './presenter/board-presentor';
import FilterPresenter from './presenter/filter-presenter.js';
import TasksModel from './model/task-model.js';
import FilterModel from './model/filter-model.js';
import TaskApiService from './tasks-api-service.js';

const AUTHORIZATION = 'Basic hS2sfS44wcl1sa2j';
const END_POINT = 'https://20.objects.pages.academy/task-manager';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

const tasksModel = new TasksModel({
  tasksApiService: new TaskApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();
const boardPresentor = new BoardPresenter({ boardContainer: siteMainElement, tasksModel, filterModel, onNewTaskDestroy: handleNewTaskFormClose });
const filterPresenter = new FilterPresenter({
  filterContainer: siteMainElement,
  filterModel,
  tasksModel
});

const newTaskButtonComponent = new NewTaskButtonView({
  onClick: handleNewTaskButtonClick
});

function handleNewTaskFormClose() {
  newTaskButtonComponent.element.disabled = false;
}

function handleNewTaskButtonClick() {
  boardPresentor.createTask();
  newTaskButtonComponent.element.disabled = true;
}


filterPresenter.init();
boardPresentor.init();
tasksModel.init()
  .finally(() => {
    render(newTaskButtonComponent, siteHeaderElement);
  });
