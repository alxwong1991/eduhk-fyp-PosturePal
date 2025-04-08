import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "./Logo";
import useAuthStore from "../stores/authStore";
import {
  NavContainer,
  NavContent,
  RightSection,
  NavButton,
  UserInfo,
  UserName,
  Spacer,
} from "../styles/components/NavMenuStyles";

const NavMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore(); // Get user & logout function from useAuth
  
  const handleLogout = () => {
    logout(); // Calls logout function from useAuth
    Swal.fire({
      title: "Logged Out",
      text: "You have been successfully logged out.",
      icon: "info",
      confirmButtonText: "OK",
    });

    navigate("/dashboard");
  };

  return (
    <>
      <NavContainer>
        <NavContent>
          <Logo onClick={() => navigate("/dashboard")} />
          <RightSection>
            {user ? (
              <>
                <UserInfo>
                  Hello, <UserName>{user.name}</UserName>
                </UserInfo>
                {location.pathname !== "/profile" && (
                  <NavButton onClick={() => navigate("/profile")}>Profile</NavButton>
                )}
                <NavButton onClick={handleLogout}>Logout</NavButton>
              </>
            ) : (
              <>
                <UserInfo>
                  <UserName>Not Logged In</UserName>
                </UserInfo>
                <NavButton onClick={() => navigate("/login")}>Login</NavButton>
              </>
            )}
          </RightSection>
        </NavContent>
      </NavContainer>
      <Spacer />
    </>
  );
};

export default NavMenu;