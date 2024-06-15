/* eslint-disable no-irregular-whitespace */

/* -------------------------------------------------------------------------- */
/*                             Services End Points                            */
/* -------------------------------------------------------------------------- */

export const SERVICE_ADD_EP = 'Service/AddService';
export const SERVICE_EDIT_EP = 'Service/EditService';
export const SERVICE_DELETE_EP = 'Service/deleteService';
export const SERVICE_ACTIVE_INACTIVE_EP = 'Service/activateAndDeactivateService';
export const SERVICE_BY_ID_EP = 'Service/getServiceById';
export const SERIVCE_LIST_EP = 'Service/GetSPServices';
export const SERIVCE_SEARCH_BY_NAME_EP = 'Service/SearchbyServiceName';
export const SERVICE_TOP_LIST_EP = 'Service/GetTopServices';
export const SERVICES_CATEGORIES_SALES = 'Service/ViewSaleServices';

/* -------------------------------------------------------------------------- */
/*                        GeneralCenterType End Points                        */
/* -------------------------------------------------------------------------- */

export const GCT_EP = 'GeneralCenterType/Get';
export const GCT_EDIT_EP = 'GeneralCenterType/Edit';
export const GCT_DELETE_EP = 'GeneralCenterType/Delete';
export const GCT_ALL_EP = 'GeneralCenterType/AllGeneralCenterTypes';
export const GCT_BUSSINESS_CATEGORIES_EP = 'GeneralCenterType/GetBussinessCategories';
export const GCT_BUSSINESS_CATEGORIES_ORDERD_EP =
  'BusinessCategory/GetBussinessCategoriesOrderedByName';
export const GCT_SERVICES_LIST_EP = 'GeneralCenterType/serviceList';
export const GCT_OF_SP_EP = 'GeneralCenterType/ServiceProviderGeneralCenterTypes';
export const GCT_ADD_EP = 'GeneralCenterType/AddGCT';
export const GCT_TYPES_EP = 'GeneralCenterType/GetGCTTypes';
export const GCT_BY_ID_EP = 'GeneralCenterType/GetGCTById';

/* -------------------------------------------------------------------------- */
/*                             Category End Points                            */
/* -------------------------------------------------------------------------- */

export const CATEGORY_ALL_EP = 'Category/ViewCategories';
export const CATEGORY_ADD_EP = 'Category/AddCategory';
export const CATEGORY_RENAME_EP = 'Category/RenameCategory';
export const CATEGORY_DELETE_EP = 'Category/DeleteCategory';
export const CATEGORY_BY_ID_EP = 'Category/getById';
export const CATEGORY_LIST_BY_CT_EP = 'Category/GetCenterTypeCategories';
export const CATEGORY_UPDATE_SERVICE_EP = 'Category/UpdateServicesCategory';
export const CATEGORY_MANAGE_SYSTEM = 'SystemCategory/GetSystemCategories';
export const CATEGORY_ENABLE_DISABLE = 'SystemCategory/MangeCategory';
export const CATEGORY_DELETE = 'SystemCategory/Delete';

/* -------------------------------------------------------------------------- */
/*                            CenterType End Points                           */
/* -------------------------------------------------------------------------- */

export const CT_EDIT_EP = 'CenterType/Edit';
export const CT_DELETE_EP = 'CenterType/Delete';
export const CT_ADD_EP = 'CenterType/Add';
export const CT_BY_GCT_ID_EP = 'CenterType/GetCenterTypesByGCTID';
export const CT_BY_ID_EP = 'CenterType/GetCTById';

/* -------------------------------------------------------------------------- */
/*                               CenterTypeOdata                              */
/* -------------------------------------------------------------------------- */

export const CT_ODATA_ALL_EP = '​CenterTypeOdata';
export const CT_ODATA_COUNT_EP = 'CenterTypeOdata/Count';
