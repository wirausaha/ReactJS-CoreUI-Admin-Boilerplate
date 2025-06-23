/* =====================================================
|   Komponen OveridePassword.Jsx
|   Komponnen untuk meng-overide password kalau pengguna lupa passwordnya
|   Ditulis oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/
import { cilSave, cilActionUndo } from '@coreui/icons'

import CIcon from '@coreui/icons-react'
import {
  CButton,  CCol,
  CFormInput,
  CRow,
  CFormLabel,
} from '@coreui/react'

const OverridePassword = ({ isOveriding, userName, overidePassword, setOveridePassword, handleSavePassword, handleCancel }) => {
  if (!isOveriding) return null;

  return (
    <div style={{ marginBottom: "10px" }}>
      <CRow>
        <CCol xs={12}>
          <CFormLabel htmlFor="inputAddress">
            Override password pengguna: <strong>{userName}</strong>
          </CFormLabel>
          <CFormInput
            id="inputOveridePassword"
            type="text"
            value={overidePassword}
            onChange={(e) => setOveridePassword(e.target.value)}
            maxLength={32}
          />
        </CCol>
      </CRow>
      <CRow style={{ marginTop: "10px" }}>
        <CCol xs={12}>
          <div style={{ display: "flex", gap: "10px" }}>
            <CButton className="rounded-0" color="primary" id="btnSaveOveride" style={{ width: "120px" }} onClick={handleSavePassword}>
              <CIcon icon={cilSave} style={{ marginRight: "5px" }} /> Simpan
            </CButton>
            <CButton className="rounded-0" color="primary" id="btnCancelOveride" style={{ width: "120px" }} onClick={handleCancel}>
              <CIcon icon={cilActionUndo} style={{ marginRight: "5px" }} /> Batal
            </CButton>
          </div>
        </CCol>
      </CRow>
    </div>
  );
};

export default OverridePassword;
