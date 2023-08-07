import { getRandomTask } from '../mock/task.js';

const TASK_COUNT = 3;

export default class TaskModel {
  tasks = Array.from({length: TASK_COUNT}, getRandomTask);

  getTasks() {
    return this.tasks;
  }
}
