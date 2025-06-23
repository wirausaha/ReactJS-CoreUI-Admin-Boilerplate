/* =====================================================
|   Komponen FormToobal.Jsx
|   Komponen untuk interaksi user
|   Ditulis oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/
import { cilPlus, cilPencil } from '@coreui/icons'

import CIcon from '@coreui/icons-react'
import {
  CButton,
} from '@coreui/react'

const FormToolbar = ({ isEditing, isOveriding, isViewProfile, handleAddNew, handleEdit, selectedItem, handleSearch }) => (
  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
    <div style={{ display: isEditing || isOveriding || isViewProfile ? "none" : "flex", gap: "10px" }}>
      <CButton className="rounded-0" color="primary" id="btnAdd" style={{ width: "120px" }} onClick={handleAddNew}>
        <CIcon icon={cilPlus} style={{ marginRight: "5px" }} /> Tambah
      </CButton>
      <CButton className="rounded-0" color="primary" id="btnEdit" style={{ width: "120px" }} disabled={!selectedItem} onClick={handleEdit}>
        <CIcon icon={cilPencil} style={{ marginRight: "5px" }} /> Ubah
      </CButton>
    </div>
    <div>
      <input
        type="text"
        maxLength="32"
        placeholder="Filter Username"
        style={{ display: isEditing || isOveriding || isViewProfile ? "none" : "block" }}
        onChange={handleSearch}
      />
    </div>
  </div>
);

export default FormToolbar;
