import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilUser,  cilCloudDownload, cilSave, cilActionUndo } from '@coreui/icons'
import {
  CButton,
  CCol,
} from '@coreui/react'

const FormActions = ({ isEditing, isAdding, isViewProfile, handleAddRow, handleCancel }) => (
  <CCol xs={12}>
    <div style={{ display: !isEditing && !isViewProfile ? "none" : "flex", gap: "10px", marginRight: "10px" }}>
      <CButton
        className="rounded-0"
        color="primary"
        id="btnSave"
        style={{ display: !isViewProfile ? "flex" : "none", width: "120px" }}
        onClick={handleAddRow}
      >
        <CIcon icon={cilSave} style={{ marginRight: "5px" }} /> Simpan
      </CButton>
      <CButton
        className="rounded-0"
        color="primary"
        id="btnCancel"
        style={{ display: isEditing || isAdding || isViewProfile ? "flex" : "none", width: "120px" }}
        onClick={handleCancel}
      >
        <CIcon icon={cilActionUndo} style={{ marginRight: "5px" }} /> Batal
      </CButton>
    </div>
  </CCol>
);

export default FormActions;
