import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "./Logo";
import { logoutUser } from "../api/auth";

const NavContainer = styled.nav`
  width: 100%;
  position: fixed; /* ✅ Make navbar fixed at the top */
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.3);
  z-index: 1000;
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavButton = styled.button`
  padding: 8px 16px;
  border: 2px solid #fff;
  border-radius: 8px;
  background: transparent;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 1rem;
`;

const UserName = styled.span`
  font-weight: 500;
`;

const Spacer = styled.div`
  height: 80px; /* ✅ Add space below navbar */
`;

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
                Welcome, <UserName>{userName}</UserName>
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