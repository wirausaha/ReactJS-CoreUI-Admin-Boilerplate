/* =====================================================
|   Komponen AccountField.Jsx
|   Komponen untuk input username, password dan email (registrasi)
|   Ditulis oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/
import {
  CCol,
  CFormInput,
  CFormLabel,
} from '@coreui/react'

const AccountFields = ({ isAdding, isViewProfile, userName, setUserName, password, setPassword, email, setEmail }) => (
  <>
    <CCol md={4} style={{ display: isAdding ? "block" : "none" }}>
      <CFormLabel htmlFor="inputUsername">Username</CFormLabel>
      <CFormInput
        type="text"
        id="inputUsername"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        maxLength={32}
      />
    </CCol>
    <CCol md={4} style={{ display: isAdding ? "block" : "none" }}>
      <CFormLabel htmlFor="inputPassword">Password</CFormLabel>
      <CFormInput
        type="password"
        id="inputPassword"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        maxLength={32}
      />
    </CCol>
    <CCol md={4} style={{ display: isAdding ? "block" : "none" }}>
      <CFormLabel htmlFor="inputEmail">Email</CFormLabel>
      <CFormInput
        type="text"
        id="inputEmail"
        value={email}
        disabled={isViewProfile}
        onChange={(e) => setEmail(e.target.value)}
        maxLength={32}
      />
    </CCol>
  </>
);

export default AccountFields;
