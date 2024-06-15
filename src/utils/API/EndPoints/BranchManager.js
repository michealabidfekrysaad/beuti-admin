/* eslint-disable no-irregular-whitespace */

/* -------------------------------------------------------------------------- */
/*                          branch manager endpoints                          */
/* -------------------------------------------------------------------------- */

export const BRAND_MANAGERS = 'Brand/GetBrandManagers';
export const BRAND_CHANGE_BRANCH_MANAGER = 'brand/ChangeBranchManager';

/* -------------------------------------------------------------------------- */
/*                     phone related to brand and branches                    */
/* -------------------------------------------------------------------------- */

export const MANAGER_PHONE_AVAILABLE = 'Brand/IsManagerPhoneNumberAvailable';
export const OWNER_UPDATE_PHONE_NUMBER = 'Brand/UpdateBrandOwnerPhoneNumber';
export const OWNER_CONFIRM_UPDATE_PHONE = 'Brand/ConfirmBrandOwnerPhoneNumber';
export const SP_GET_OWNER_BRANCHES = 'ServiceProvider/GetOwnerBranches';

/* -------------------------------------------------------------------------- */
/*                    get all branches for the login brand                    */
/* -------------------------------------------------------------------------- */
export const SP_GET_USER_BRANCHES = 'ServiceProvider/GetUserBranches';

/* -------------------------------------------------------------------------- */
/*                 get the missing information for each branch                */
/* -------------------------------------------------------------------------- */
export const SP_GET_Branches_missing = 'serviceProvider/GetBranchesWithMissingInfo';

/* -------------------------------------------------------------------------- */
/*                              details of branch                             */
/* -------------------------------------------------------------------------- */
export const SP_GET_BRANCHES_INFO = 'ServiceProvider/GetBranchInformationSettings';
export const SP_UPDATE_BRANCHES_INFO = 'ServiceProvider/UpdateBranchInformationSettings';
