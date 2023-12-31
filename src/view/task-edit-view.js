import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { COLORS } from '../const.js';
import { humanizeTaskDueDate, isTaskRepeating } from '../utils/task.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';


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


function createTaskEditColorsTemplate(currentColor, isDisabled) {
  return COLORS.map((color) => `<input
      type="radio"
      id="color-${color}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${currentColor === color ? 'checked' : ''}
      ${isDisabled ? 'disabled' : ''}
    />
    <label
      for="color-${color}"
      class="card__color card__color--${color}"
      >black</label
    >`).join('');
}

function createTaskEditReapeatingTemplate(repeating, isRepeating, isDisabled) {
  return (`
      <button class="card__repeat-toggle" type="button" ${isDisabled ? 'disabled' : ''}>
        repeat:<span class="card__repeat-status">${isRepeating ? 'yes' : 'no'}</span>
      </button>

      ${isRepeating ? `<fieldset class="card__repeat-days">
        <div class="card__repeat-days-inner">
          ${Object.entries(repeating).map(([day, repeat]) => `<input
            class="visually-hidden card__repeat-day-input"
            type="checkbox"
            id="repeat-${day}"
            name="repeat"
            value="${day}"
            ${repeat ? 'checked' : ''}
            ${isDisabled ? 'disabled' : ''}
          />
          <label class="card__repeat-day" for="repeat-${day}"
            >${day}</label
          >`).join('')}
        </div>
      </fieldset>` : ''}`
  );
}

function createTaskEditDateTemplate(dueDate, isDueDate, isDisabled) {
  return (
    `
    <button class="card__date-deadline-toggle" type="button" ${isDisabled ? 'disabled' : ''}>
      date: <span class="card__date-status">${isDueDate !== null ? 'yes' : 'no'}</span>
    </button>

    ${isDueDate ?
      `<fieldset class="card__date-deadline">
        <label class="card__input-deadline-wrap">
          <input
            class="card__date"
            type="text"
            placeholder=""
            name="date"
            value="${humanizeTaskDueDate(dueDate)}"
            ${isDisabled ? 'disabled' : ''}
          />
        </label>
      </fieldset>`
      : ''}
    `
  );
}

function createTaskEditTemplate(data) {
  const {
    color,
    description,
    dueDate,
    repeating,
    isDueDate,
    isRepeating,
    isDisabled,
    isSaving,
    isDeleting,
  } = data;

  const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate, isDisabled);
  const repeatingClassName = isRepeating
    ? 'card--repeat'
    : '';

  const repeatingTemplate = createTaskEditReapeatingTemplate(repeating, isRepeating, isDisabled);
  const colorsTemplate = createTaskEditColorsTemplate(color, isDisabled);

  const isSubmitDisabled = (isDueDate && dueDate === null) || (isRepeating && !isTaskRepeating(repeating));

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
              ${isDisabled ? 'disabled' : ''}
            >${he.encode(description)}</textarea>
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
                ${colorsTemplate}
              </div>
            </div>
          </div>

        <div class="card__status-btns">
          <button class="card__save" type="submit" ${isSubmitDisabled || isDisabled ? 'disabled' : ''}>
            ${isSaving ? 'saving...' : 'save'}
          </button>
          <button class="card__delete" type="button" ${isDisabled ? 'disabled' : ''}>
            ${isDeleting ? 'deleting...' : 'delete'}
          </button>
        </div>
      </form>
    </article>
  `;
}

export default class TaskEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #datepicker = null;

  constructor({ task = BLANK_TASK, onFormSubmit, onDeleteClick }) {
    super();
    this._setState(TaskEditView.parseTaskToState(task));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createTaskEditTemplate(this._state);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  }

  reset(task) {
    this.updateElement(TaskEditView.parseTaskToState(task));
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.card__date-deadline-toggle')
      .addEventListener('click', this.#dueDateToggleHandler);
    this.element.querySelector('.card__repeat-toggle')
      .addEventListener('click', this.#repeatingToggleHandler);
    this.element.querySelector('.card__text').addEventListener('input', this.#descriptionInputHandler);
    this.element.querySelector('.card__colors-wrap').addEventListener('change', this.#colorChangeHandler);
    this.element.querySelector('.card__delete').addEventListener('click', this.#formDeleteClickHandler);

    if (this._state.isRepeating) {
      this.element.querySelector('.card__repeat-days-inner').addEventListener('change', this.#repeatingChangeHandler);
    }

    this.#setDatepicker();
  }

  #colorChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      color: evt.target.value,
    });
  };

  #descriptionInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      description: evt.target.value,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(TaskEditView.parseStateToTask(this._state));
  };

  #dueDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dueDate: userDate,
    });
  };

  #dueDateToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isDueDate: !this._state.isDueDate,
      isRepeating: !this._state.isDueDate ? false : this._state.isRepeating,
    });
  };

  #repeatingToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isRepeating: !this._state.isRepeating,
      isDueDate: !this._state.isRepeating ? false : this._state.isDueDate,
    });
  };

  #repeatingChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      repeating: { ...this._state.repeating, [evt.target.value]: evt.target.checked },
    });
  };

  #setDatepicker() {
    if (this._state.isDueDate) {
      this.#datepicker = flatpickr(this.element.querySelector('.card__date'),
        {
          dateFormat: 'j F',
          defaultDate: this._state.dueDate,
          onChange: this.#dueDateChangeHandler, // На событие flatpickr передаём наш колбэк
        }
      );
    }
  }

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(TaskEditView.parseStateToTask(this._state));
  };

  static parseTaskToState(task) {
    return {
      ...task,
      isDueDate: task.dueDate !== null,
      isRepeating: isTaskRepeating(task.repeating),
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToTask(state) {
    const task = { ...state };

    if (!task.isDueDate) {
      task.dueDate = null;
    }

    if (!task.isRepeating) {
      task.repeating = {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false,
      };
    }

    delete task.isDueDate;
    delete task.isRepeating;
    delete task.isDisabled;
    delete task.isSaving;
    delete task.isDeleting;

    return task;
  }
}
