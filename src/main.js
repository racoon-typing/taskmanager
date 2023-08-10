import { render } from './framework/render.js';
import NewTaskButtonView from './view/new-task-button-view';
import FilterView from './view/filter-view';
import BoardPresenter from './presenter/board-presentor';
import TaskModel from './model/task-model.js';
import { generateFilter } from './mock/filter.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');
const taskModel = new TaskModel();
const boardPresentor = new BoardPresenter({boardContainer: siteMainElement, taskModel});

const filters = generateFilter(taskModel.tasks);

render(new NewTaskButtonView(), siteHeaderElement);
render(new FilterView({filters}), siteMainElement);

boardPresentor.init();
