import styled from 'styled-components';

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;  // Increased gap between icon and text
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const LogoIcon = styled.div`
  background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
  width: 50px;  // Increased from 40px
  height: 50px; // Increased from 40px
  border-radius: 15px; // Slightly increased for better proportion
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;  // Increased from 24px
  color: white;
  box-shadow: 0 4px 15px rgba(74, 144, 226, 0.3);
`;

export const LogoText = styled.div`
  font-size: 32px;  // Increased from 24px
  font-weight: bold;
  color: ${props => props.color || '#fff'};
  letter-spacing: 0.5px;  // Added for better readability
  
  span {
    color: #4a90e2;
  }
`;

// For the home page, you might want an even larger version
export const LargeLogoContainer = styled(LogoContainer)`
  transform: scale(1.2);  // Makes the entire logo 20% larger
  margin: 20px 0;  // Add some margin for spacing
`;