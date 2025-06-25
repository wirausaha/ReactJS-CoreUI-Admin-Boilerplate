import React from 'react'
import { useState, useEffect } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom';
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilDoor,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import apiInstance from "../../helpers/Api";


//import avatar8 from './../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {

  const [avatar, setAvatar] = useState("");


  const handleLogout = async () => {

    try {
        const response = await apiInstance.post("/api/auth/logout");
        console.log("Response Data:", response.data);
        if (response.data.success) {
          console.log("logout");
        }
      } catch (error) {
        console.error("Error API:", error);
      }
      // berhasil atau gagal tetap hapus localstorage dan login kembali
      localStorage.removeItem("token");
      localStorage.removeItem("refreshtoken");
      localStorage.removeItem("rememberme");
      window.location.href = "/login";

    };

  const getAvatar = async () => {

    try {
        const response = await apiInstance.get("/api/user/getavatar");
        console.log("Response Data:", response.data);
        if (response.data.success) {
          setAvatar(response.data.avatar);
        }
      } catch (error) {
        console.error("Error API:", error);
      }

  }

  useEffect(() => {
    getAvatar();
  });


  const navigate = useNavigate();


  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={`${import.meta.env.VITE_BASE_URL}${avatar}`} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ cursor: "pointer" }}>
          <CIcon icon={cilAccountLogout} className="me-2"  />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
