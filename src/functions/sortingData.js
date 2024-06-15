/* eslint-disable no-param-reassign */
/* eslint-disable func-names */

// This function will be used to sort data in categories list
// NOTE: for any purpose you may change it make sure that categories sort doesn't break.
export function sortDataList(data, sortingBy, direction) {
  if (direction === 'ascEn') direction = 'asc';
  if (direction === 'desEn') direction = 'desc';
  if (!sortingBy) return data;
  let sorted;
  if (sortingBy === 'id') {
    sorted = data.sort(function(a, b) {
      return direction === 'asc' ? a.id - b.id : b.id - a.id;
    });
  } else {
    sorted = data.sort(function(a, b) {
      const nameA =
        direction === 'asc' ? a[sortingBy].toUpperCase() : b[sortingBy].toUpperCase();
      const nameB =
        direction === 'asc' ? b[sortingBy].toUpperCase() : a[sortingBy].toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }
  return sorted;
}
