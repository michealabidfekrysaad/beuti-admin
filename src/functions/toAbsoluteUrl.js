export const toAbsoluteUrl = (pathname) => process.env.PUBLIC_URL + pathname;
export const handleImageString = (img) => img?.substring(img?.indexOf(',') + 1);
