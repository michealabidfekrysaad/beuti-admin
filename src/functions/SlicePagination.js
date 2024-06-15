export const slicePagination = (array, page_size, page_number) =>
  array &&
  array.slice(
    Number(page_number) * Number(page_size),
    Number(page_number + 1) * Number(page_size),
  );
