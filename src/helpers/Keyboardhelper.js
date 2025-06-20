/* =====================================================
|   Keyboardhelper.Js
|
|   Lisensi : Freeware
========================================================*/
export const handleKeyDownHelper = (event, callback) => {
  //console.log("Key pressed:", event.key);
  if (event.key === "Enter") {
    callback();
  }
};
