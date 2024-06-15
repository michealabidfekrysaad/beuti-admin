export const serviceStrngifyFormat = (id, location) =>
  JSON.stringify({ serviceId: id, locationId: location });

export const getAllServicesLength = (cate, propName) =>
  cate && cate?.reduce((prev, current) => prev + (current[propName]?.length || 0), 0);

export const getSelectedServicesLength = (servrices, selectedServices) => {
  if (selectedServices && servrices) {
    const stringyAllServices = servrices?.map((service) =>
      serviceStrngifyFormat(service.id, service.location),
    );
    return stringyAllServices.filter((item) => selectedServices.includes(item)).length;
  }
  return 0;
};

export const getAllServicesAsArrayOfString = (cate, propName) => {
  let spreadAllServices = [];
  if (cate && propName) {
    spreadAllServices = cate.reduce(
      (prev, current) => [...prev, ...(current[propName] || [])],
      [],
    );
  } else if (cate) {
    spreadAllServices = [...cate];
  }
  const stringfiyAllServices = spreadAllServices.map((item) =>
    serviceStrngifyFormat(item?.id, item?.location),
  );
  return stringfiyAllServices;
};

export const removeAllServicesOfCate = (servrices, selectedServices) => {
  if (selectedServices && servrices) {
    const stringyAllServices = servrices?.map((service) =>
      serviceStrngifyFormat(service.id, service.location),
    );
    // Return All The Selected Service Without Current Category Services
    return selectedServices.filter((item) => !stringyAllServices.includes(item));
  }
  return 0;
};

export const addAllCateServices = (services = [], selectedCategory) => {
  const stringyAllServices = selectedCategory?.map((service) =>
    serviceStrngifyFormat(service.id, service.location),
  );

  if (services?.length > 0) {
    return [
      ...services,
      ...stringyAllServices.filter((item) => !services.find((ele) => ele === item)),
    ];
  }
  return [...stringyAllServices];
};
