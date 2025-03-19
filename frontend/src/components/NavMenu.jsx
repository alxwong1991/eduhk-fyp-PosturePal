import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || null
  );

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
    navigate("/");
  };

  return (
    <>
      <NavContainer>
        <NavContent>
          <Logo onClick={() => navigate("/dashboard")} />
          <RightSection>
            {userName ? (
              <UserInfo>
                Hello, <UserName>{userName}</UserName>
              </UserInfo>
            ) : (
              <UserInfo>
                <UserName>Not Logged In</UserName>
              </UserInfo>
            )}
            <NavButton onClick={handleLogout}>Logout</NavButton>
          </RightSection>
        </NavContent>
      </NavContainer>
      <Spacer /> {/* ✅ Ensures content doesn't overlap with navbar */}
    </>
  );
};

export default NavMenu;
