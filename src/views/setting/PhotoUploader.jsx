/* =====================================================
|   Komponen PhotoUploader.Jsx
|   Komponen untuk mengupload avatar
|   Ditulis oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/
import {
  CCol,
  CFormInput,
  CFormLabel,
  CImage,
} from '@coreui/react'

const PhotoUploader = ({ profile, handleFileChange, isViewProfile }) => (
  <CCol md={12}>
    {profile.preview && (
      <CImage
        src={profile.preview}
        alt="Preview"
        className="img-thumbnail mt-2"
        style={{
          display: "block",
          width: "200px",
          height: "200px",
          marginBottom: "10px",
          border: "1px solid #ccc",
        }}
      />
    )}
    <CFormLabel htmlFor="photo">Foto Profil</CFormLabel>
    <CFormInput
      type="file"
      id="avatarFile"
      name="avatarFile"
      accept="image/*"
      onChange={handleFileChange}
      style={{ display: isViewProfile ? "none" : "block" }}
    />
  </CCol>
);

export default PhotoUploader;
