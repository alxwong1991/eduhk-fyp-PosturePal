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
  const [wasLoggedIn, setWasLoggedIn] = useState(false); // Track if user was logged in

  // Track previous login state
  useEffect(() => {
    if (user) {
      setWasLoggedIn(true); // Set true when user logs in
    }
  }, [user]);

  // Show "Session Expired" alert only if the user was previously logged in
  useEffect(() => {
    if (wasLoggedIn && user === null) {
      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        navigate("/login"); // Redirect to login
      });

      setWasLoggedIn(false); // Reset state to prevent repeated alerts
    }
  }, [user, wasLoggedIn, navigate]);

  const handleLogout = () => {
    logout(); // Calls logout function from useAuth
    setWasLoggedIn(false); // Reset to prevent session expired alert

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