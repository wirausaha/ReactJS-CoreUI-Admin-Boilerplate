import {
  CCol,
  CFormInput,
  CFormLabel,
} from '@coreui/react'

const AddressFields = ({ isViewProfile, address, setAddress,
          address2, setAddress2, city, setCity, province, setProvince, zipCode, setZipCode }) => (
  <>
    <CCol xs={6}>
      <CFormLabel htmlFor="inputAddress">Alamat</CFormLabel>
      <CFormInput
        id="inputAddress"
        disabled={isViewProfile}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        maxLength={40}
      />
    </CCol>
    <CCol xs={6}>
      <CFormLabel htmlFor="inputAddress2">Alamat 2</CFormLabel>
      <CFormInput
        id="inputAddress2"
        disabled={isViewProfile}
        value={address2}
        onChange={(e) => setAddress2(e.target.value)}
        maxLength={40}
      />
    </CCol>
    <CCol md={6}>
      <CFormLabel htmlFor="inputCity">Kota</CFormLabel>
      <CFormInput
        id="inputCity"
        disabled={isViewProfile}
        value={city}
        onChange={(e) => setCity(e.target.value)}
        maxLength={20}
      />
    </CCol>
    <CCol md={4}>
      <CFormLabel htmlFor="inputProvince">Propinsi</CFormLabel>
      <CFormInput
        id="inputProvince"
        disabled={isViewProfile}
        value={province}
        onChange={(e) => setProvince(e.target.value)}
        maxLength={20}
      />
    </CCol>
    <CCol md={2}>
      <CFormLabel htmlFor="inputZip">Kode Pos</CFormLabel>
      <CFormInput
        id="inputZip"
        disabled={isViewProfile}
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        maxLength={5}
      />
    </CCol>
  </>
);

export default AddressFields;
