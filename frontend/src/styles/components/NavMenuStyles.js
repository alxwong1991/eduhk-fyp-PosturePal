import styled from "styled-components";

export const NavContainer = styled.nav`
  width: 100%;
  position: fixed; /* Make navbar fixed at the top */
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-radius: 0 0 15px 15px;
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.3);
  z-index: 1000;
`;

export const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const NavButton = styled.button`
  padding: 8px 16px;
  border: 2px solid #fff;
  border-radius: 8px;
  background: transparent;
  color: white;
  font-size: 1.1rem;
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

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 1.2rem;
`;

export const UserName = styled.span`
  font-weight: 500;
`;

export const Spacer = styled.div`
  height: 80px; /* Add space below navbar */
`;