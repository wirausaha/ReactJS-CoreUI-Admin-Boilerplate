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
import UserProfileForm from "./UserProfile";
import FormToolbar from "./FormToolbar";
import OverridePassword from "./OveridePassword";
import UserTable from "./UserTable"


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

import {  FaEye, FaTrash, FaUnlock } from "react-icons/fa"; // Contoh menggunakan react-icons

import { Navigate } from "react-router-dom";
import { checkUserRole } from "../../helpers/CheckRole";

const Users = () => {

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") ?? ""; // Ambil token dari localStorage
  const location = useLocation();
  const navigate = useNavigate();


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
  const [dateOfBirth, setDateOfBirth] = useState(new Date().toISOString().split("T")[0]);
  const [avatar200x200, setAvatar200x200] = useState("");
  const [userRole, setUserRole] = useState("Operator");

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isOveriding, setIsOveriding] = useState(false);
  const [isViewProfile, setIsViewProfile] = useState(false);
  const [overidePassword, setOveridePassword] = useState("");
  const isAdminMode = true;

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

  const handleViewProfile = (userName) => {
      setIsViewProfile(true);
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
          title="Hapus Pengguna" style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <FaTrash size={20} color="gray" />
        </button>
        <button onClick={() => handleViewProfile(info.row.original.userName)}
          title="Lihat profil" style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <FaEye size={20} color="gray" />
        </button>
        <button onClick={() => handleOveridePassword(info.row.original.userName)}
          title="Overide (ganti) password" style={{ background: "none", border: "none", cursor: "pointer" }}
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
    // saat 1 baris data di klik masukan datanya ke masing-masing elemen
    setEmail("");
    setPassword("");
    setDateOfBirth(event.dateOfBirth ?? new Date().toISOString().split("T")[0]);
    setUserName(event.userName ?? "");
    setFirstName(event.firstName ?? "");
    setLastName(event.lastName ?? "");
    setAddress(event.address ?? "");
    setAddress2(event.address2 ?? "");
    setProvince(event.province ?? "");
    setCity(event.city ?? "");
    setZipCode(event.zipCode ?? "");
    setUserRole(event.userRole ?? "Operator");
    setAvatar200x200(event.avatar200x200 ?? "");
      setProfile({
          name: event.firstName + " " + event.lastName,
          email: event.userName,
          photo: event.avatar200x200,
          preview: `${import.meta.env.VITE_BASE_URL}${event.avatar200x200}` });
    // Pengecekan status ini dilakukan untuk mengurang flicker
    // karena setiap kali mengubah status sepertinya ReactJS merefresh layar
    // Tetapi pengecekan ini kurang bermanfaat pada baris data yang tidak memiliki avatar
    if (isEditing) setIsEditing(false); //  Aktifkan kembali input agar bisa diedit
    if (isOveriding) setIsOveriding(false);
    if (isAdding) setIsAdding(false);
    if (isViewProfile) setIsViewProfile(false);
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
        setIsViewProfile(false);

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
    setIsViewProfile(false);
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
                ? { ...unit, ...dataUser, userName: saveUserName }
                : unit
            )
          );
        } else {
          console.log("Lagi nambah");
          setData((prevData) => [...prevData, { ...dataUser }]);
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

  useEffect(() => {
    const verifyRole = async () => {
      const userRole = await checkUserRole();
      setRole(userRole);
      setLoading(false);
    };
    verifyRole();
  }, []);

  if (loading) return <p>Loading role...</p>;
  if (role !== "Superuser") return <Navigate to="/unauthorized" replace />;

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
        </CRow>
        <CRow className="mt-2" >
          <div className="row">
            <div className="col-md-12">
              <CCard className="mb-4">
                <CCardBody className="p-4">
                  {/* Tool bar untuk interaksi */}
                  <FormToolbar
                      isEditing={isEditing}
                      isOveriding={isOveriding}
                      isViewProfile={isViewProfile}
                      handleAddNew={handleAddNew}
                      handleEdit={handleEdit}
                      selectedItem={selectedItem}
                      handleSearch={handleSearch}
                    />
                  <OverridePassword
                    isOveriding={isOveriding}
                    userName={userName}
                    overidePassword={overidePassword}
                    setOveridePassword={setOveridePassword}
                    handleSavePassword={handleSavePassword}
                    handleCancel={handleCancel}
                  />
                  <UserProfileForm
                    isAdminMode={isAdminMode}
                    isEditing={isEditing}
                    isAdding={isAdding}
                    isViewProfile={isViewProfile}
                    profile={profile}
                    userName={userName}
                    setUserName={setUserName}
                    password={password}
                    setPassword={setPassword}
                    email={email}
                    setEmail={setEmail}
                    dateOfBirth={dateOfBirth}
                    setDateOfBirth={setDateOfBirth}
                    userRole={userRole}
                    setUserRole={setUserRole}
                    roleOptions={roleOptions}
                    firstName={firstName}
                    setFirstName={setFirstName}
                    lastName={lastName}
                    setLastName={setLastName}
                    address={address}
                    setAddress={setAddress}
                    address2={address2}
                    setAddress2={setAddress2}
                    city={city}
                    setCity={setCity}
                    province={province}
                    setProvince={setProvince}
                    zipCode={zipCode}
                    setZipCode={setZipCode}
                    handleAddRow={handleAddRow}
                    handleCancel={handleCancel}
                    handleFileChange={handleFileChange}
                  />

                  <UserTable
                    isEditing={isEditing}
                    isOveriding={isOveriding}
                    isViewProfile={isViewProfile}
                    isAdding={isAdding}
                    table={table}
                    limit={limit}
                    setSelectedRow={setSelectedRow}
                    handleRowClick={handleRowClick}
                    page={page}
                    setPage={setPage}
                    maxPage={maxPage}
                  />


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
