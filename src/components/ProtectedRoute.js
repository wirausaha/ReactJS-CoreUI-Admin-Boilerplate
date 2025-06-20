/* =====================================================
|   ProtectedRoute.Js
|   Mengelola data pengguna
|   Ditulis oleh : AI
|   Lisensi : Freeware
========================================================*/
import { Navigate, Outlet } from "react-router-dom";
import { isTokenValid } from  "../../src/helpers/Tokenhelpers";


const ProtectedRoute = () => {
  const token = localStorage.getItem("token") ?? false;
  const tokenValid = isTokenValid(token); // Pastikan fungsi validasi token bekerja dengan baik

  return tokenValid ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
