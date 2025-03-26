import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #1e2a3a 0%, #3d4856 100%);
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

export const SectionHeader = styled.h2`
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin: 20px 0;
`;

export const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  
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