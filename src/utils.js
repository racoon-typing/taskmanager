import dayjs from 'dayjs';

const DATE_FORMAT = 'D MMMM';

function humanizeTaskDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function isTaskExpired(dueDate) {
  return dueDate && dayjs().isAfter(dueDate, 'D');
}

function isTaskRepeating(repeating) {
  return Object.values(repeating).some(Boolean);
}

export {getRandomArrayElement, humanizeTaskDueDate, isTaskExpired, isTaskRepeating};
