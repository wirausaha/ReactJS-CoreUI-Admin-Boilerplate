/* =====================================================
|   TokenHelpers.Js
|   Lisensi : Freeware
========================================================*/
export const isTokenValid = () => {
  const token = localStorage.getItem("token") ?? false; // Ambil token dari localStorage
  if (! token) return false;  // user harus login
  const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT token
  var tokenOk = payload.exp * 1000 > Date.now();
  return tokenOk;

};
