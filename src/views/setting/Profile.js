/* =====================================================
|   Profile.Js
|   Mengelola data pengguna
|   Ditulis oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/
import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
  CImage
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import { useState } from 'react'

const Profile = (props) => {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photo: null,
    preview: null,
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        photo: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile updated:", profile);
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
              <CForm className="row g-3">

                <CCol md={12}>
                      {profile.preview && <CImage src={profile.preview} alt="Preview" style={{display: 'block', width: '200px', height: '200px', marginBottom: '10px', border: '1px solid #ccc'}} className="img-thumbnail mt-2" width={200} />}
                    <CFormLabel htmlFor="photo">Foto Profil</CFormLabel>
                    <CFormInput type="file" id="photo" name="photo" accept="image/*" onChange={handleFileChange} />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputFirstName">Nama depan</CFormLabel>
                  <CFormInput type="text" id="inputFirstName" />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputLastName">Nama belakang</CFormLabel>
                  <CFormInput type="text" id="inputLastName" />
                </CCol>
                <CCol xs={12}>
                  <CFormLabel htmlFor="inputAddress">Alamat</CFormLabel>
                  <CFormInput id="inputAddress" placeholder="1234 Main St" />
                </CCol>
                <CCol xs={12}>
                  <CFormInput id="inputAddress2" placeholder="Apartment, studio, or floor" />
                </CCol>
                <CCol md={6}>
                  <CFormLabel htmlFor="inputCity">Kota</CFormLabel>
                  <CFormInput id="inputCity" />
                </CCol>
                <CCol md={4}>
                  <CFormLabel htmlFor="inputState">Propinsi</CFormLabel>
                  <CFormSelect id="inputState">
                    <option>Choose...</option>
                    <option>...</option>
                  </CFormSelect>
                </CCol>
                <CCol md={2}>
                  <CFormLabel htmlFor="inputZip">Kode Pos</CFormLabel>
                  <CFormInput id="inputZip" />
                </CCol>
                <CCol xs={12}>
                  <CButton color="primary" type="submit" style={{ marginRight: '10px' }}>
                    Simpan
                  </CButton>
                  <CButton color="primary" type="submit">
                    Reset
                  </CButton>
                </CCol>
              </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Profile
