import { getRandomTask } from '../mock/task.js';

const TASK_COUNT = 22;

export default class TaskModel {
  #tasks = Array.from({length: TASK_COUNT}, getRandomTask);

  get tasks() {
    return this.#tasks;
  }
}
