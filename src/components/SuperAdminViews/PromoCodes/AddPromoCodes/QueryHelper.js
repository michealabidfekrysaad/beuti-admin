export const handleCheckById = (searchValue) =>
  searchValue && !!searchValue.match(/^[0-9]*$/) ? `or id eq ${searchValue}` : '';

export const handleCheckByDate = (start, end) => {
  if (start && end) {
    return `and (registrationDate gt ${start} or registrationDate eq ${start}) and (registrationDate lt ${end} or registrationDate eq ${end})`;
  }
  if (start && !end) {
    return `and (registrationDate gt ${start} or registrationDate eq ${start})`;
  }
  return ``;
};
export const handleCheckByCommission = (min, max) =>
  `and (commissionPercentage gt ${min || 0} or commissionPercentage eq ${min ||
    0}) and (commissionPercentage lt ${max || 0} or commissionPercentage eq ${max || 0})`;
