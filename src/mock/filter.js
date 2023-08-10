import { filter } from '../utils/filter.js';

function generateFilter(task) {
  return Object.entries(filter).map(
    ([filterType, filterTasks]) => ({
      type: filterType,
      count: filterTasks(task).length,
    }),
  );
}

export {generateFilter};
