export const filterBranchesSelected = (branchList, quantity) => {
  if (branchList?.length === 0) return undefined;
  let ListOfBranchesSelected = [];
  if (branchList?.length === 1) {
    ListOfBranchesSelected = branchList
      ?.filter((branch) => branch.isSelected)
      ?.map((item) => ({
        Id: item.id,
        Quantity: quantity,
      }));
  }
  if (branchList?.length > 1) {
    ListOfBranchesSelected = branchList
      ?.filter((branch) => branch.isSelected)
      ?.map((item) => ({
        Id: item.id,
        Quantity: item.quantity,
      }));
  }
  return ListOfBranchesSelected.length >= 1 ? ListOfBranchesSelected : undefined;
};
