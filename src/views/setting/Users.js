/* =====================================================
|   Users.Js
|   Mengelola data pengguna
|   Ditulis oleh : Fajrie R Aradea
|   Lisensi : Freeware
========================================================*/
import React from 'react'
import { useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import usePagination from "../../hooks/usePagination";
import { debounce, set } from "lodash"; // membatasi waktu pengetikan


import {  CButton,  CCard,   CCardBody,   CCol,
  CContainer,
  CForm,
  CFormSelect,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CTab,
  CTable,
  CTableHead,
  CPagination,
  CPaginationItem,
  CFormLabel,
  CImage,
  CFormText,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilUser,  cilCloudDownload, cilSave, cilActionUndo } from '@coreui/icons'

import apiInstance from "../../helpers/Api";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import defaultData from './id'
import PaginationComponent from '../../components/PaginationComponent';


// Column Definitions
const columnHelper = createColumnHelper()

import {  FaTrash, FaUnlock } from "react-icons/fa"; // Contoh menggunakan react-icons
import { CCardGroup, CCardHeader, CCardTitle, CCardText } from '@coreui/react'

const Users = () => {

  const token = localStorage.getItem("token") ?? ""; // Ambil token dari localStorage
  const location = useLocation();
  const navigate = useNavigate();

  // States

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date().toISOString().split("T"));
  const [avatar200x200, setAvatar200x200] = useState("");
  const [userRole, setUserRole] = useState("Operator");

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isOveriding, setIsOveriding] = useState(false);
  const [overidePassword, setOveridePassword] = useState("");

  const [data, setData] = useState(() => defaultData)

  const [isAvatarChanged, setIsAvatarChanged] = useState(false); // State untuk melacak perubahan avatar
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterUser, setFilterUser] = useState("");

  const [profile, setProfile] = useState({
      name: "",
      email: "",
      photo: null,
      preview: null,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        photo: file,
        avatarFile: file,
        preview: URL.createObjectURL(file),
      });
      setIsAvatarChanged(true);
    }
  };

  /* ======================================
  | Hapus data pengguna
  ======================================= */
  const handleDeleteRow = async (userName) => {
    console.log("Menghapus Pengguna :", userName);
    try {
      const response = await apiInstance.post("/api/user/deleteuser", {
        userName: userName, oldPassword: "", newPassword: ""});

      console.log("Response Data:", response.data);
      if (response.data.success) {
        alert("Data berhasil dihapus!");
        setData((prevData) => prevData.filter((unit) => unit.userName !== userName));
      }
    } catch (error) {
      console.error("Error API:", error);
      alert(`Data gagal dihapus! Alasan: ${error.response?.data?.message || "Terjadi kesalahan pada server"}`);
    }

  };

  const columns = [
    columnHelper.accessor("avatar200x200", {
      header: "Avatar",
      cell: (info) => (
        <img
          src={`${import.meta.env.VITE_BASE_URL}${info.getValue()}`}
          alt="Avatar"
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
      ),
    }),
    columnHelper.accessor("userName", {
      header: "User Name",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("firstName", {
      header: "First Name",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("lastName", {
      header: "Last Name",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor("userRole", {
      header: "Role",
      cell: (info) => <span>{info.getValue()}</span>,
    }),
    {
      header: "Aksi",
      cell: (info) => (
        <>
        <button onClick={() => handleDeleteRow(info.row.original.userName)}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <FaTrash size={20} color="gray" />
        </button>
        <button onClick={() => handleOveridePassword(info.row.original.userName)}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <FaUnlock size={20} color="gray" />
        </button>
 </>
      ),
    }
];


  const defaultColumn = {
    cell: ({ getValue, row, column, table }) => {
      return <EditableCell getValue={getValue} row={row} column={column} table={table} />
    }
  }

  /* ======================================
  | Komponen Tabel EditableCell
  ======================================= */
  let totalrecords = 0; //  State untuk menyimpan jumlah halaman
  let totalfiltereds = 0; //  State untuk menyimpan jumlah halaman
  const [currentpage, setCurrentPage] = useState(1); // Mulai dari halaman pertama
  const limit = 30; // Jumlah data per halaman

  // Pagination sekarang menggunakan custom
  const { page, maxPage, setMaxPage, setPage, nextPage, prevPage } = usePagination(currentpage, limit, totalfiltereds);


  // Hooks untuk tabel
  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: () => false
    },

    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData(old =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value
              }
            }

            return row
          })
        )
      }
    }
  })

  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await apiInstance.get("/api/user/userrole");
      if (response.data.success) {
        const mapped = response.data.role.map((role) => ({
          label: role,
          value: role
        }));
        setRoleOptions(mapped);
      }
    };

    fetchRoles();
  }, []);


  const fetchData = async (page, filterUser) => {
      try {
        const response = await apiInstance.get("/api/user/getuserswithpagination", {
              params: { draw: 0, page: page, limit: limit, filter: filterUser }
          });
        console.log("Response Data:", response.data);
        if (response.data.success) {
          setData(response.data.userlist.data);
          totalrecords = response.data.userlist.recordstotal;
          totalfiltereds = response.data.userlist.recordsFiltered;
          var nmaxpage = Math.ceil(Number(response.data.userlist.recordsFiltered) / limit);
          setMaxPage(nmaxpage);
        }
      } catch (error) {
        console.error("Error API:", error);
      }

  };

  useEffect(() => {

    const handler = setTimeout(() => {
        fetchData(page, filterUser);
    }, 300); // Menunda eksekusi selama 300ms
    return () => clearTimeout(handler);

  }, [page, filterUser]);


  const validasiUser = async () => {
    if (isAdding) {
      var testUserName = (userName ?? "").trim();
      var testEmail = (email ?? "").trim();
      var testPassword = (password ?? "").trim();

      if (testUserName == "" || testEmail == "" || testPassword == "") {
        alert("Username, password dan email tidak boleh kosong");
        return false;
      }
      if (testUserName.length < 6 || testPassword.length < 6 ) {
        alert("Username dan password harus minimal 5 karakter!");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (! emailRegex.test(testEmail)) {
        alert("Email tidak valid!");
        return false;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/;
      if (! passwordRegex.test(testPassword)) {
        alert("Password harus minimal 5 karakter dan mengandung huruf besar, kecil, serta angka!");
        return false;
      }

      const response = await apiInstance.post("/api/user/usernameoremailexists",
          { "userName": testUserName, "email": testEmail, "password": "" });

      if (response.data.success.exists) {
        alert("Username / email sudah ada di database");
        return false;
      }
      return true;
    } else {
      return true
    }
  }


  const handleRowClick = (event) => {
    setEmail("");
    setPassword("");
    setDateOfBirth(event.dateOfBirth ?? new Date().toISOString().split("T")[0]);
    setUserName(event.userName);
    setFirstName(event.firstName);
    setLastName(event.lastName);
    setAddress(event.address);
    setAddress2(event.address2);
    setProvince(event.province);
    setCity(event.city);
    setZipCode(event.zipCode);
    setUserRole(event.userRole ?? "Operator");
    setAvatar200x200(event.avatar200x200);

    setProfile({
        name: event.firstName + " " + event.lastName,
        email: event.userName,
        photo: event.avatar200x200,
        preview: `${import.meta.env.VITE_BASE_URL}${event.avatar200x200}` });

    setIsEditing(false); //  Aktifkan kembali input agar bisa diedit
    setSelectedItem( event);
    setSelectedRow(event.index); // Simpan ID baris yang diklik
  };

  const handleSearch = debounce(async (event) => {
      const searchTerm = event.target.value;
      setFilterUser(searchTerm);
  }, 300);

  const handleEdit = (nEditMode)  => {
      setIsEditing(true);
      setIsAdding(false);
      setIsOveriding(false);
  }

  const handleCancel = ()  => {
      if (selectedItem != null ) {
        setUserName(selectedItem.userName ?? "");
        setFirstName(selectedItem.firstName ?? "");
        setLastName(selectedItem.lastName ?? "");
        setAddress(selectedItem.address ?? "");
        setAddress2(selectedItem.address2 ?? "");
        setProvince(selectedItem.province ?? "");
        setCity(selectedItem.city ?? "");
        setZipCode(selectedItem.zipCode ?? "");
        setAvatar200x200(selectedItem.avatar200x200 ?? "");
        setUserRole(selectedItem.userRole);
        setZipCode(selectedItem.zipCode ?? "");
        setProfile({
          name: selectedItem.firstName + " " + selectedItem.lastName,
          email: selectedItem.userName,
          photo: selectedItem.avatar200x200,
          preview: `${import.meta.env.VITE_BASE_URL}${selectedItem.avatar200x200}`,
          avatarFile: null
        });

      }
      setUserName("");
      setEmail("");
      setPassword("");
      setIsAvatarChanged(false);
      setIsEditing(false);
      setIsAdding(false);
      setIsOveriding(false);

  }

  const handleAddNew = () => {
    setUserName("");
    setEmail("");
    setPassword("");
    setDateOfBirth(new Date().toISOString().split("T")[0]);
    setFirstName("");
    setLastName("");
    setAddress("");
    setAddress2("");
    setProvince("");
    setCity("");
    setZipCode("");
    setUserRole("Operator");
    setProfile({
      name: "",
      email: "",
      photo: null,
      preview: null,
      avatarFile: null
    });

    setIsAdding(true);
    setIsEditing(true);
    setIsOveriding(false);
    setIsAvatarChanged(false);
  };

  const handleOveridePassword = async () =>
  {
      setIsOveriding(true);
      setOveridePassword("");
  }

  const validPassword = (savePassword) =>
  {
    if (savePassword.length < 6 ) {
        alert("Password minimal 6 karakter!");
        return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (! passwordRegex.test(savePassword)) {
      alert("Password harus minimal 6 karakter dan mengandung huruf besar, kecil, serta angka!");
      return false;
    }

      return true;
  }

  const handleSavePassword = async () =>
  {

     if (userName == null || userName == "") {
        alert("Pilih dulu data pemakai");
        return;
     }
     var savePassword = (overidePassword ?? "").trim();
     if (! validPassword(savePassword)) {
        return;
     }

    const formData = new FormData();
    formData.append("userName", (userName ?? "").trim());
    formData.append("oldPassword", "oldpassword");
    formData.append("newPassword", savePassword);

    try {
        const response =await apiInstance.post("/api/user/overidepassword", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

      //console.log("Response Data:", response.data);
      if (response.data.success) {
        alert("Password disimpan, beritahu user untuk login dengan password baru yang anda berikan dan segera mengganti password")
        handleCancel();
      }
    } catch (error) {
      console.error("Error API:", error);
      alert(`Password gagal disimpan! Alasan: ${error.response?.data?.message || "Terjadi kesalahan pada server"}`);
    }
  }

  const fileInput = document.getElementById("avatarFile");

  const handleAddRow = async () =>
  {

    var saveUserName = (userName ?? "").trim();

    if (! await validasiUser()) {
      return;
    }

    console.log(userRole);
    const formData = new FormData();
    formData.append("userName", (userName ?? "").trim());
    formData.append("password", (password ?? "").trim());
    formData.append("email", (email ?? "").trim());
    formData.append("dateOfBirth", dateOfBirth );
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("address", address);
    formData.append("address2", address2);
    formData.append("province", province);
    formData.append("city", city);
    formData.append("zipCode", zipCode);
    formData.append("userRole", userRole ?? "");
    formData.append("isActive", 1);


    if (isAvatarChanged && profile.avatarFile) {
      console.log("Avatar changed");
      formData.append("avatarFile", profile.avatarFile);
    }

    var locApiupdate = "/api/user/updateuser";
    var locApiadd = "/api/user/addnewuser";
    var locApi = (isAdding) ? locApiadd : locApiupdate;

    console.log(locApi);

    try {
        const response =await apiInstance.post(locApi, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

      //console.log("Response Data:", response.data);
      if (response.data.success) {
        var dataUser = response.data.user;
        console.log("Data user : ", dataUser);
        if (! isAdding) {
          console.log("Lagi ubah");
          setData((prevData) =>
            prevData.map((unit) =>
              unit.userName === dataUser.userName
                ? { avatar200x200: dataUser.avatar200x200, userName: saveUserName,
                    firstName: dataUser.firstName, lastName: dataUser.lastName,
                    userRole: dataUser.userRole }
                : unit
            )
          );
        } else {
          console.log("Lagi nambah");
          setData((prevData) => [
            ...prevData,
            { avatar200x200: dataUser.avatar200x200, userName: dataUser.userName,
                    firstName: dataUser.firstName, lastName: dataUser.lastName,
                    userRole: dataUser.userRole },
          ]);
        }
        // Reset input
        handleCancel();
        alert("Data berhasil disimpan!"); //

      }
    } catch (error) {
      console.error("Error API:", error);
      alert(`Data gagal disimpan! Alasan: ${error.response?.data?.message || "Terjadi kesalahan pada server"}`);
    }


  };

  return (
    <>
    <CCard className="mb-4">
      <CCardBody>
        <CRow>
          <CCol sm={5}>
            <h4 id="traffic" className="card-title mb-0">
              Daftar Pengguna
            </h4>
          </CCol>
          <CCol sm={7} className="d-none d-md-block">
            <CButton color="primary" className="float-end">
              <CIcon icon={cilCloudDownload} />
            </CButton>
          </CCol>
        </CRow>
        <CRow className="mt-2" >
          <div className="row">
            <div className="col-md-12">
              <CCard className="mb-4">
                <CCardBody className="p-4">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px",  alignItems: "center", marginBottom: "10px" }}>
                      <div style={{ display: isEditing || isOveriding ? "none" : "flex", gap: "10px" }}>
                        <CButton className="rounded-0" color="primary" id="btnAdd" style={{ width: "120px" }}
                          onClick={() => handleAddNew()} >
                          <CIcon icon={cilPlus} style={{ marginRight: "5px" }} /> Tambah
                        </CButton>
                        <CButton
                          className="rounded-0" color="primary" id="btnEdit" style={{ width: "120px" }} disabled={selectedItem == null}
                          onClick={() => handleEdit()} >
                          <CIcon icon={cilPencil} style={{ marginRight: "5px" }} /> Ubah
                        </CButton>
                      </div>
                      <div>
                        <input style={{display: isEditing || isOveriding ? "none" : "block" }} maxLength="32" type="text" placeholder="Filter Username" onChange={handleSearch} />
                      </div>
                    </div>
                    <div style={{display: isOveriding ? "block" : "none", marginBottom: "10px" }}>
                      <CRow>
                        <CCol xs={12}>
                          <CFormLabel htmlFor="inputAddress">Overide password pengguna</CFormLabel>
                          <CFormInput id="inputOveridePassword" placeholder=""
                            type="text"
                            value={overidePassword} onChange={(e) => setOveridePassword(e.target.value)}
                            maxLength={32}/>
                        </CCol>
                      </CRow>
                      <CRow style={{marginTop: "10px"}}>
                        <CCol xs={12}>
                          <div style={{ display: ! isOveriding  ? "none" : "flex", gap: "10px" }}>
                              <CButton className="rounded-0" color="primary" id="btnSaveOveride" style={{ width: "120px" }}
                                onClick={() => handleSavePassword()} >
                                <CIcon icon={cilSave} style={{ marginRight: "5px" }} /> Simpan
                              </CButton>
                              <CButton
                                className="rounded-0" color="primary" id="btnCancelOveride" style={{ width: "120px" }}
                                onClick={() => handleCancel()} >
                                <CIcon icon={cilActionUndo} style={{ marginRight: "5px" }} /> Batal
                              </CButton>
                          </div>
                        </CCol>
                      </CRow>
                    </div>
                    <div style={{display: isEditing ? "block" : "none", marginBottom: "10px" }}>
                      <CRow>
                        <CCol xs={12}>
                          <CCard className="mb-4">
                            <CCardBody>
                                <CForm className="row g-3">
                                  <CCol md={12}>
                                        {profile.preview && <CImage src={profile.preview} alt="Preview" style={{display: 'block', width: '200px', height: '200px', marginBottom: '10px', border: '1px solid #ccc'}} className="img-thumbnail mt-2" width={200} />}
                                      <CFormLabel htmlFor="photo">Foto Profil</CFormLabel>
                                      <CFormInput type="file" id="avatarFile" name="avatarFile" accept="image/*" onChange={handleFileChange} />
                                  </CCol>
                                  <CCol md={4} style={{display: isAdding ? "block" : "none" }}>
                                    <CFormLabel htmlFor="inputUsername">Username</CFormLabel>
                                    <CFormInput type="text" id="inputUsername"
                                      value={userName} onChange={(e) => setUserName(e.target.value)}
                                      maxLength={32} />
                                  </CCol>
                                  <CCol md={4} style={{display: isAdding ? "block" : "none" }}>
                                    <CFormLabel htmlFor="inputPassword">Password</CFormLabel>
                                    <CFormInput type="password" id="inputPassword"
                                      value={password} onChange={(e) => setPassword(e.target.value)}
                                      maxLength={32} />
                                  </CCol>
                                  <CCol md={4} style={{display: isAdding ? "block" : "none" }}>
                                    <CFormLabel htmlFor="inputEmail">Email</CFormLabel>
                                    <CFormInput type="text" id="inputEmail"
                                      value={email} onChange={(e) => setEmail(e.target.value)}
                                      maxLength={32} />
                                  </CCol>
                                  <CCol md={6} >
                                    <CFormLabel htmlFor="dateOfBirth">Tanggal lahir</CFormLabel>
                                    <input type="date" className="form-control" id="dateOfBirth"
                                      value={dateOfBirth || ""} onChange={(e) => setDateOfBirth(e.target.value)}
                                       name="dateOfBirth"></input>
                                  </CCol>
                                  <CCol md={6} >
                                    <CFormLabel htmlFor="userRole">Role</CFormLabel>
                                    <CFormSelect
                                      id="userRole"
                                        options={roleOptions}
                                        value={userRole || ""}
                                        onChange={(e) => setUserRole(e.target.value)}
                                      />
                                  </CCol>
                                  <CCol md={6}>
                                    <CFormLabel htmlFor="inputFirstName">Nama depan</CFormLabel>
                                    <CFormInput type="text" id="inputFirstName"
                                      value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                      maxLength={32} />
                                  </CCol>
                                  <CCol md={6}>
                                    <CFormLabel htmlFor="inputLastName">Nama belakang</CFormLabel>
                                    <CFormInput type="text" id="inputLastName"
                                      value={lastName} onChange={(e) => setLastName(e.target.value)}
                                      maxLength={32}/>
                                  </CCol>
                                  <CCol xs={6}>
                                    <CFormLabel htmlFor="inputAddress">Alamat</CFormLabel>
                                    <CFormInput id="inputAddress" placeholder=""
                                      value={address} onChange={(e) => setAddress(e.target.value)}
                                      maxLength={40}/>
                                  </CCol>
                                  <CCol xs={6}>
                                    <CFormLabel htmlFor="inputAddress">Alamat 2</CFormLabel>
                                    <CFormInput id="inputAddress2" placeholder=""
                                      value={address2} onChange={(e) => setAddress2(e.target.value)}
                                      maxLength={40} />
                                  </CCol>
                                  <CCol md={6}>
                                    <CFormLabel htmlFor="inputCity">Kota</CFormLabel>
                                    <CFormInput id="inputCity"
                                      value={city}  onChange={(e) => setCity(e.target.value)}
                                      maxLength={20}/>
                                  </CCol>
                                  <CCol md={4}>
                                    <CFormLabel htmlFor="inputProvince">Propinsi</CFormLabel>
                                    <CFormInput id="inputProvince" placeholder="Propinsi"
                                      value={province} onChange={(e) => setProvince(e.target.value)}
                                      maxLength={20}/>
                                  </CCol>
                                  <CCol md={2}>
                                    <CFormLabel htmlFor="inputZip">Kode Pos</CFormLabel>
                                    <CFormInput id="inputZip"
                                      value={zipCode} onChange={(e) => setZipCode(e.target.value)}
                                      maxLength={5} />
                                  </CCol>
                                  <CCol xs={12}>
                                    <div style={{ display: ! isEditing ? "none" : "flex", gap: "10px" }}>
                                      <CButton className="rounded-0" color="primary" id="btnSave" style={{ width: "120px" }}
                                        onClick={() => handleAddRow()} >
                                        <CIcon icon={cilSave} style={{ marginRight: "5px" }} /> Simpan
                                      </CButton>
                                      <CButton
                                        className="rounded-0" color="primary" id="btnCancel" style={{ width: "120px" }}
                                        onClick={() => handleCancel()} >
                                        <CIcon icon={cilActionUndo} style={{ marginRight: "5px" }} /> Batal
                                      </CButton>
                                    </div>
                                  </CCol>
                                </CForm>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      </CRow>
                    </div>
                    <table className="table table-small table-bordered table-hover">
                      <CTableHead color="light">
                        {table.getHeaderGroups().map(headerGroup => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                              <th key={header.id}>
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </CTableHead>
                      <tbody>
                        {table
                          .getRowModel()
                          .rows.slice(0, limit)
                          .map(row => {
                            return (
                              <tr
                                key={row.id} onClick={(event) => setSelectedRow(event.currentTarget)}
                                style={{cursor: "pointer"}}
                                >
                                  {row.getVisibleCells().map(cell => {
                                  return (
                                    <td key={cell.id} onClick={() => {
                                    handleRowClick(cell.row.original); }} style={{ cursor: "pointer" }}>
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                  )
                                })}
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>

                    <PaginationComponent page={page} setPage={setPage} maxPage={maxPage} pagesPerGroup={10} />

                </CCardBody>
              </CCard>
            </div>
          </div>
        </CRow>
      </CCardBody>
    </CCard>
    </>
  )
}

export default Users
