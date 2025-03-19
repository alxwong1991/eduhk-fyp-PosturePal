import {
  LogoIcon,
  LogoContainer,
  LogoText,
  LargeLogoContainer,
} from "../styles/components/LogoStyles";

const Logo = ({ onClick, color, large }) => {
  const Container = large ? LargeLogoContainer : LogoContainer;

  return (
    <Container onClick={onClick}>
      <LogoIcon>🏋️</LogoIcon>
      <LogoText color={color}>
        Posture<span>Pal</span>
      </LogoText>
    </Container>
  );
};

export default Logo;
