export const convertTimeToMinuts = (time) => {
  if (!time) return null;
  const parts = time.split(':');
  const minutes = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  return minutes;
};

export const convertMinsToHours = (mins, messages) => {
  if (!mins) return `00 ${messages['common.min']}`;
  const hrsNum = Math.floor(mins / 60);
  const minsNum = mins % 60;
  return `${hrsNum === 0 ? `` : `${hrsNum} ${messages['common.h']} `}${
    minsNum === 0 ? `` : `${minsNum} ${messages['common.min']}`
  }`;
};

export const DisplayTimeRange = (min, max, messages) => {
  if (!min || !max) return null;
  if (min === max) {
    return convertMinsToHours(min, messages);
  }

  return `${convertMinsToHours(min, messages)} - ${convertMinsToHours(max, messages)}`;
};
