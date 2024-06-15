export function HandleSuccessAndErrorMsg(setter, msg) {
  setter(msg);
  setTimeout(() => {
    setter(false);
  }, 3000);
}
