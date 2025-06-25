/* =====================================================
|   Komponen PersonalField.Jsx
|   Komponen untuk input data pribadi
|   Ditulis oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/
import {
  CCol,
  CFormSelect,
  CFormInput,
  CFormLabel,
} from '@coreui/react'

const PersonalProfile = ({ isViewProfile, dateOfBirth, setDateOfBirth,
          roleOptions, userRole, setUserRole,
          firstName, setFirstName, lastName, setLastName }) => (
  <>
    <CCol md={6}>
      <CFormLabel htmlFor="dateOfBirth">Tanggal lahir</CFormLabel>
      <input
        type="date"
        className="form-control"
        id="dateOfBirth"
        name="dateOfBirth"
        disabled={isViewProfile}
        value={dateOfBirth || ""}
        onChange={(e) => setDateOfBirth(e.target.value)}
      />
    </CCol>
    <CCol ms={6}></CCol>
    <CCol md={6}>
      <CFormLabel htmlFor="inputFirstName">Nama depan</CFormLabel>
      <CFormInput
        type="text"
        id="inputFirstName"
        disabled={isViewProfile}
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        maxLength={32}
      />
    </CCol>
    <CCol md={6}>
      <CFormLabel htmlFor="inputLastName">Nama belakang</CFormLabel>
      <CFormInput
        type="text"
        id="inputLastName"
        disabled={isViewProfile}
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        maxLength={32}
      />
    </CCol>
  </>
);

export default PersonalFields;
