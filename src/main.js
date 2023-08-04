import NewTaskButtonView from './view/new-task-button-view';
import FilterView from './view/filter-view';
import { render } from './render.js';

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

render(new NewTaskButtonView(), siteHeaderElement);
render(new FilterView(), siteMainElement);

