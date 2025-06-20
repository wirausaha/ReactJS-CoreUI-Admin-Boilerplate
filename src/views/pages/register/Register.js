/* =====================================================
|   Register.Js
|   Mengelola data pengguna
|   Ditulis oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/
import React from 'react'
import { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { Link, useLocation, Navigate, useNavigate } from 'react-router-dom'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { handleKeyDownHelper } from "../../../helpers/Keyboardhelper"; //  Import helper untuk menangani keydown
import { isTokenValid } from "../../../helpers/Tokenhelpers";

const validasiDaftar = (username, email, password, repeatpassword, termsaggrement) => {

  if (!username || !password || !email || !repeatpassword) {
    alert("Semua kolom harus diisi !");
    return false;
  }

  if (!termsaggrement) {
    alert("Anda harus menyetujui syarat dan ketentuan!");
    return false;
  }

  if (username.length < 6 || password.length < 6) {
    alert("Username dan password harus minimal 6 karakter!");
    return false;
  }

  if (password !== repeatpassword) {
    alert("Password dan Repeat Password harus sama!");
    return false;
  }

  // Pakai regex saja
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (! emailRegex.test(email)) {
    alert("Email tidak valid!");
    return false;
  }

  // Pakai regex saja
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (! passwordRegex.test(password)) {
    alert("Password harus minimal 5 karakter dan mengandung huruf besar, kecil, serta angka!");
    return false;
  }

  return true;
};

const Register = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const fromPage = location.state?.from || "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatpassword, setRepeatPassword] = useState("");
  const [termsAgrement, setTermsAgrement] = useState(false);
  const [email, setEmail] = useState("");


  const token = localStorage.getItem("token") ?? false;
  const tokenValid = isTokenValid(token); // Cek apakah token valid

  if (tokenValid) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async () =>
  {

    if (validasiDaftar(username, email, password, repeatpassword, termsAgrement))
    {
      try {
        // Login tidak menggunakan axios
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username, email: email, password: password, termsagrement: true }),
        });
        if (! response.ok) {
          alert("Registrasi gagal ");
          return;
        }
        const data = await response.json();
        if (data.success) {
          alert("Registrasi berhasil, silakan login!");
          window.location.href = "/login";
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
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput placeholder="Username"
                        autoComplete="username"
                        onChange={(e) => setUsername(e.target.value)} />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput placeholder="Email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}/>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      onKeyDown={(event) => handleKeyDownHelper(event, handleSubmit)}
                    />
                  </CInputGroup>
                    <CInputGroup className="mb-3">
                      <input
                        type="checkbox"
                        id="termsAgrement"
                        checked={termsAgrement}
                        onChange={(e) => setTermsAgrement(e.target.checked)}
                        style={{ marginRight: "8px" }}
                      />
                      <span htmlFor="termsAgrement">I agree to Terms and Conditions</span>
                    </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" onClick={handleSubmit}>Create Account</CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
