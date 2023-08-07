import NewTaskButtonView from './view/new-task-button-view';
import FilterView from './view/filter-view';
import BoardPresenter from './presenter/board-presentor';
import { render } from './render.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');
const boardPresentor = new BoardPresenter({boardContainer: siteMainElement});

render(new NewTaskButtonView(), siteHeaderElement);
render(new FilterView(), siteMainElement);

boardPresentor.init();
