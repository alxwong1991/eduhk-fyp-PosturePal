import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

export const Section = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  max-width: 1000px;
  margin-top: 20px;
`;

export const ProfileCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 45%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

export const ProfileImage = styled.div`
  font-size: 80px;
  text-align: center;
  margin-bottom: 20px;
`;

export const Info = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
`;

export const Label = styled.span`
  font-weight: bold;
`;

export const Value = styled.span`
  color: #555;
`;

export const Placeholder = styled.div`
  width: 45%;
  height: 300px;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  color: #777;
  border-radius: 10px;
`;