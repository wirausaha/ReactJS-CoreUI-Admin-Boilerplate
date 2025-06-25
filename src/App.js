import React, { Suspense, useEffect, useContext } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { AuthContext, AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import { CSpinner, useColorModes } from '@coreui/react'
import { isTokenValid } from  "../src/helpers/Tokenhelpers";

import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))

const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))
const Unauthorized = React.lazy(() => import('./views/pages/unauthorize/Unauthorize'))

const App = () => {

  const token = localStorage.getItem("token") ?? false; // Ambil token dari localStorage
  const tokenValid = isTokenValid(token); // Cek apakah token valid

  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }
    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const RoleGuard = ({ allowedRole, children }) => {
    const { role, loading } = useUserRole();

    if (loading) return <p>Loading...</p>;
    if (role !== allowedRole) return <Navigate to="/unauthorized" />;

    return children;
  };

  return (
    <AuthProvider>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }
          >
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<Page404 />} />
            <Route path="/500" element={<Page500 />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Semua halaman lain hanya bisa diakses jika token valid */}
            <Route element={<ProtectedRoute />}>
              <Route path="*" element={<DefaultLayout />} />
            </Route>
          </Routes>

          </Suspense>
        </BrowserRouter>
    </AuthProvider>

  )
}

export default App
