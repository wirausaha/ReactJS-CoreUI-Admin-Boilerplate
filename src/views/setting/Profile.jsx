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


import {  CButton,  CCard, CCardBody, CCol, CRow } from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilUser,  cilCloudDownload, cilSave, cilActionUndo } from '@coreui/icons'

import apiInstance from "../../helpers/Api";

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

import defaultData from './id'


// Column Definitions
const columnHelper = createColumnHelper()

import {  FaEye, FaTrash, FaUnlock } from "react-icons/fa"; // Contoh menggunakan react-icons

const Profile = () => {

  const token = localStorage.getItem("token") ?? ""; // Ambil token dari localStorage
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
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

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [roleOptions, setRoleOptions] = useState(["Superuser", "Administrator", "Operator", "Kasir", "Lainnya" ]);

  const [data, setData] = useState({})

  const [isEditing, setIsEditing] = useState(true);
  const [isChangePassword, setIsChangePassword] = useState(false);

  const [isAvatarChanged, setIsAvatarChanged] = useState(false); // State untuk melacak perubahan avatar

  const isViewProfile = false;

  const [profile, setProfile] = useState({
      name: "",
      email: "",
      photo: null,
      preview: null,
  });

  useEffect(() => {

    const fetchUserData = async () => {
      const response = await apiInstance.get("/api/user/getmyprofile");
      if (response.data.success) {
        setData(response.data.user)
      }

    };

    fetchUserData();
    setIsEditing(true);

  }, []);

  useEffect(() => {
    console.log("Fetch data : ", data);
    if (data) {
      setFirstName(data.firstName ?? "");
      setLastName(data.lastName ?? "");
      setAddress(data.address ?? "");
      setAddress2(data.address2 ?? "");
      setProvince(data.province ?? "");
      setDateOfBirth(data.dateOfBirth);
      setCity(data.city ?? "");
      setZipCode(data.zipCode ?? "");
      setAvatar200x200(data.avatar200x200 ?? "");
      setUserRole(data.userRole);
      setZipCode(data.zipCode ?? "");
      setProfile({
        name: data.firstName + " " + data.lastName,
        email: data.userName,
        photo: data.avatar200x200,
        preview: `${import.meta.env.VITE_BASE_URL}${data.avatar200x200}`,
        avatarFile: null
      });
      //setIsViewProfile(false);
      setUserName(data.userName);
      setEmail(data.email);
      setPassword(data.password);

    }

   }, [data]);

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

  };

  const handleEdit = (nEditMode)  => {
      setIsEditing(true);
      setIsAdding(false);
      setIsChangePassword(false);
  }


  const handleCancel = ()  => {
      /* setFirstName(data.firstName ?? "");
      setLastName(data.lastName ?? "");
      setAddress(data.address ?? "");
      setAddress2(data.address2 ?? "");
      setProvince(data.province ?? "");
      setCity(data.city ?? "");
      setZipCode(data.zipCode ?? "");
      setAvatar200x200(data.avatar200x200 ?? "");
      setUserRole(data.userRole);
      setZipCode(data.zipCode ?? "");
      setProfile({
        name: data.firstName + " " + data.lastName,
        email: data.userName,
        photo: data.avatar200x200,
        preview: `${import.meta.env.VITE_BASE_URL}${data.avatar200x200}`,
        avatarFile: null
      });

      setUserName(data.userName);
      setEmail(data.email);
      setPassword(data.password); */

      setIsAvatarChanged(false);
      setIsEditing(true);
      setIsChangePassword(false);

  }

   const handleChangePassword = async () =>
  {
      setIsChangePassword(true);
      setNewPassword("");
      setRepeatPassword("");
      setOldPassword("");

  }

  const validPassword = (oldPassword, newPassword, repeatPassword) =>
  {
    if (oldPassword.length < 6 || newPassword.length < 6 || repeatPassword.length < 6)  {
        alert("Panjang password lama dan baru minimal 6 karakter!");
        return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (! passwordRegex.test(newPassword)) {
      alert("Password harus minimal 6 karakter dan mengandung huruf besar, kecil, serta angka!");
      return false;
    }
    if ( newPassword != repeatPassword) {
      alert("Password baru dan ketik ulang password baru harus sama!");
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

     var saveNewPassword = (newPassword ?? "").trim();
     var saveRepeatPassword = (repeatPassword ?? "").trim();
     if (! validPassword(oldPassword, newPassword, repeatPassword)) {
        return;
     }

    const formData = new FormData();
    formData.append("userName", (userName ?? "").trim());
    formData.append("oldPassword", oldPassword);
    formData.append("newPassword", savePassword);

    try {
        const response =await apiInstance.post("/api/user/changepassword", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

      //console.log("Response Data:", response.data);
      if (response.data.success) {
        alert("Password baru telah disimpan")
        handleCancel();
      }
    } catch (error) {
      console.error("Error API:", error);
      alert(`Password gagal disimpan! Alasan: ${error.response?.data?.message || "Terjadi kesalahan pada server"}`);
    }
  }

  const fileInput = document.getElementById("avatarFile");

  const validasiUser = async () => {
      return true
  }

  const handleAddRow = async () =>
  {

    var saveUserName = (userName ?? "").trim();

    // komponen ini memang sengaja tidak melakukan Validasi
    // Validasi setelah logik aplikasi yang akan dibuat ditentukan
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

    var locApi = "/api/user/updateuser";

    console.log(locApi);

    try {
        const response =await apiInstance.post(locApi, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

      //console.log("Response Data:", response.data);
      if (response.data.success) {
        setData(response.data.user);
        var dataUser = response.data.user;
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
              Profile : {userName}
            </h4>
          </CCol>
        </CRow>
        <CRow className="mt-2" >
          <div className="row">
            <div className="col-md-12">
              <CCard className="mb-4">
                <CCardBody className="p-4">
                  {/* Tool bar untuk interaksi */}
                  <UserProfileForm
                    isAdminMode={false}
                    isEditing={isEditing}
                    isAdding={false}
                    isViewProfile={false}
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

export default Profile
