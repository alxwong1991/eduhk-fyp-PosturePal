import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
`;

export const LogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* ✅ Always 2 cards per row */
  gap: 15px;
  width: 100%;
  margin-top: 20px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr); /* ✅ Switch to 1 column on small screens */
  }
`;

export const LogCard = styled.div`
  background: rgba(255, 255, 255, 0.15); /* ✅ Glassmorphism effect */
  backdrop-filter: blur(10px);
  padding: 20px;
  border-radius: 15px;
  width: 100%;
  box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.2);
  color: white;
  margin-bottom: 15px;
`;

export const LogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 10px;
  margin-bottom: 10px;
`;

export const LogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Info = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
`;

export const Label = styled.span`
  font-weight: bold;
  color: #fff;
`;

export const Value = styled.span`
  color: #f0f0f0;
`;

export const DeleteButton = styled.button`
  background: transparent;
  color: white;
  border: 2px solid #fff;
  font-size: 1.2rem;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: red;
    color: white;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
  font-size: 1rem;
  color: #fff;
`;

export const PageButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: 0.3s;

  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.3);
  }
`;