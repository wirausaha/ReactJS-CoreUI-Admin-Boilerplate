/* =====================================================
|   Komponen UserProfile.Jsx
|   Menampilkan dan edit data pengguna
|   Ditulis oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/
import {
  CCard,   CCardBody,   CCol,
  CForm,
  CRow,
} from '@coreui/react'

import PhotoUploader from "./PhotoUploader";
import AccountFields from "./AccountFields";
import PersonalFields from "./PersonalField";
import AddressFields from "./AddressField";
import FormActions from "./FormActions";


// UserProfileForm.jsx
const UserProfileForm = (props) => {

const { isEditing, isViewProfile, isAdding } = props;

 if (!isEditing && !isAdding && !isViewProfile) {
    return null;
  }

  return (
    <CRow style={{ marginBottom: "10px" }}>
      <CCol xs={12}>
        <CCard className="mb-4" style={{ border: "none" }}>
          <CCardBody>
            <CForm className="row g-3">
              <PhotoUploader {...props} />
              <AccountFields {...props} />
              <PersonalFields {...props} />
              <AddressFields {...props} />
              <FormActions {...props} />
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default UserProfileForm;
