/* =====================================================
|   Login.Js
|   Mengelola data pengguna
|   Ditulis oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/
import React from 'react'
import { useContext } from "react";
import { Link, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilLockUnlocked, cilUser } from '@coreui/icons'
import { handleKeyDownHelper } from "../../../helpers/Keyboardhelper"; //  Import helper untuk menangani keydown
import { isTokenValid } from "../../../helpers/Tokenhelpers";

const validasiLogin = (username, password) => {

  if (!username || !password) {
    alert("Username dan password tidak boleh kosong!");
    return false;
  }

  if (username.length < 5 || password.length < 5) {
    alert("Username dan password harus minimal 5 karakter!");
    return false;
  }

/*   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/;

  if (! passwordRegex.test(password)) {
    alert("Password harus minimal 5 karakter dan mengandung huruf besar, kecil, serta angka!");
    return false;
  } */

  return true;
};

const Login = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const fromPage = location.state?.from || "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const token = localStorage.getItem("token") ?? false;
  const tokenValid = isTokenValid(token); // Cek apakah token valid

  if (tokenValid) {
    return <Navigate to="/dashboard" />;
  }


const handleSubmit = async () =>
  {

    if (validasiLogin(username, password))
    {
      try {
        // Login tidak menggunakan axios
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username, password: password, rememberme: rememberMe }),
        });
        if (!response.ok) {
          alert("Login gagal!"); //  Ini akan muncul jika status bukan 200
          return;
        }
        const data = await response.json(); //  Ambil data dari backend
        if (data.success) {
          localStorage.setItem("token", data.token); // simpan access token
          localStorage.setItem("refreshtoken", data.refreshtoken); // simpan refresh token
          localStorage.setItem("rememberme", rememberMe)
          navigate(fromPage);
          //window.location.href = "/dashboard"; // Redirect ke Home
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username"
                          autoComplete="username"
                          onChange={(e) => setUsername(e.target.value)}
                          />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText onClick={() => setPasswordVisible(!passwordVisible)} style={{ cursor: "pointer" }}>
                        <CIcon icon={passwordVisible ? cilLockUnlocked : cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onKeyDown={(event) => handleKeyDownHelper(event, handleSubmit)}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ marginRight: "8px" }}
                      />
                      <span htmlFor="rememberMe">Remember Me</span>
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleSubmit}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
