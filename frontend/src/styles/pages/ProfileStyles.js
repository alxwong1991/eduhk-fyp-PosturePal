import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #1f1c2c, #928dab); /* ✅ Modern gradient background */
  min-height: 100vh;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
`;

export const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.15); /* ✅ Glassmorphism effect */
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 15px;
  width: 100%;
  box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  color: white;
  text-align: center;
`;

export const ProfileImage = styled.div`
  font-size: 100px;
  text-align: center;
  margin-bottom: 20px;
`;

export const Info = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3); /* ✅ Subtle dividers */
  
  &:last-child {
    border-bottom: none;
  }
`;

export const Label = styled.span`
  font-weight: bold;
  color: #fff;
`;

export const Value = styled.span`
  color: #f0f0f0;
`;

export const Placeholder = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  backdrop-filter: blur(10px);
`;