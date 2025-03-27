import styled from "styled-components";

export const ProgressContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
`;

export const ProgressBar = styled.div`
  height: 20px;
  border-radius: 10px;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  line-height: 20px;
  transition: width 0.5s ease-in-out;
  margin-top: 1rem;
`;

export const Label = styled.span`
  color: white;
  font-weight: bold;
  font-size: 1.6rem;
`;