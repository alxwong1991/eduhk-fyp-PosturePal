import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "./Logo";
import { logoutUser } from "../api/auth";
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
  const [userName, setUserName] = useState(localStorage.getItem("userName") || null);

  useEffect(() => {
    const handleStorageChange = () => {
      setUserName(localStorage.getItem("userName") || null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUserName(null);
    navigate("/dashboard");

    Swal.fire({
      title: "Logged Out",
      text: "You have been successfully logged out.",
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  return (
    <>
      <NavContainer>
        <NavContent>
          <Logo onClick={() => navigate("/dashboard")} />
          <RightSection>
            {userName ? (
              <>
                <UserInfo>
                  Hello, <UserName>{userName}</UserName>
                </UserInfo>
                <NavButton onClick={() => navigate("/profile")}>Profile</NavButton>
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