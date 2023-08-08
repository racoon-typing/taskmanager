import { createElement } from '../render.js';
import { COLORS } from '../const.js';
import {humanizeTaskDueDate, isTaskRepeating} from '../utils.js';


const BLANK_TASK = {
  color: COLORS[0],
  description: '',
  dueDate: null,
  repeating: {
    mo: false,
    tu: true,
    we: false,
    th: true,
    fr: false,
    sa: false,
    su: false,
  },
  isArchive: false,
  isFavorite: false,
};

function createTaskEditReapeatingTemplate(repeating) {
  return (`
    <button class="card__repeat-toggle" type="button">
      repeat:<span class="card__repeat-status">${isTaskRepeating(repeating) ? 'yes' : 'no'}</span>
    </button>

      <fieldset class="card__repeat-days">
        <div class="card__repeat-days-inner">
          ${Object.entries(repeating).map(([day, repeat]) => `
            <input
              class="visually-hidden card__repeat-day-input"
              type="checkbox"
              id="repeat-${day}"
              name="repeat"
              value="${day}"
              ${repeat ? 'checked' : ''}
            />
            <label class="card__repeat-day" for="repeat-${day}"
              >
              ${day}
            </label
          `).join('')}
          >
        </div>
      </fieldset>
  `);
}


function createTaskEditDateTemplate(dueDate) {
  return (
    `
    <button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${dueDate !== null ? 'yes' : 'no'}</span>
    </button>

    <fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${humanizeTaskDueDate(dueDate)}"
        />
      </label>
    </fieldset>
    `
  );
}

function createTaskEditTemplate(data) {
  const { color, description, dueDate, repeating } = data;

  const dateTemplate = createTaskEditDateTemplate(dueDate);
  const repeatingClassName = isTaskRepeating(repeating)
    ? 'card--repeat'
    : '';

  const repeatingTemplate = createTaskEditReapeatingTemplate(repeating);

  return `
    <article class="card card--edit card--${color} ${repeatingClassName}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >
                ${description}
              </textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                ${dateTemplate}

                ${repeatingTemplate}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                <input
                  type="radio"
                  id="color-black-4"
                  class="card__color-input card__color-input--black visually-hidden"
                  name="color"
                  value="black"
                />
                <label
                  for="color-black-4"
                  class="card__color card__color--black"
                  >black</label
                >
                <input
                  type="radio"
                  id="color-yellow-4"
                  class="card__color-input card__color-input--yellow visually-hidden"
                  name="color"
                  value="yellow"
                  checked
                />
                <label
                  for="color-yellow-4"
                  class="card__color card__color--yellow"
                  >yellow</label
                >
                <input
                  type="radio"
                  id="color-blue-4"
                  class="card__color-input card__color-input--blue visually-hidden"
                  name="color"
                  value="blue"
                />
                <label
                  for="color-blue-4"
                  class="card__color card__color--blue"
                  >blue</label
                >
                <input
                  type="radio"
                  id="color-green-4"
                  class="card__color-input card__color-input--green visually-hidden"
                  name="color"
                  value="green"
                />
                <label
                  for="color-green-4"
                  class="card__color card__color--green"
                  >green</label
                >
                <input
                  type="radio"
                  id="color-pink-4"
                  class="card__color-input card__color-input--pink visually-hidden"
                  name="color"
                  value="pink"
                />
                <label
                  for="color-pink-4"
                  class="card__color card__color--pink"
                  >pink</label
                >
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>
  `;
}

export default class TaskEditView {
  constructor({ task = BLANK_TASK }) {
    this.task = task;
  }

  getTemplate() {
    return createTaskEditTemplate(this.task);
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
