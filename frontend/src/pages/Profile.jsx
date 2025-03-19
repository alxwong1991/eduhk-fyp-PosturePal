import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/auth"; 
import NavMenu from "../components/NavMenu";
import { Container, ProfileCard, ProfileImage, Info, Label, Value, Section, Placeholder } from "../styles/pages/ProfileStyles";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <Container>Loading profile...</Container>;
  }

  if (!user) {
    return <Container>No user data available.</Container>;
  }

  return (
    <Container>
      <NavMenu />
      <Section>
        <ProfileCard>
          <ProfileImage>
            {user.gender === "Male" ? "👨" : user.gender === "Female" ? "👩" : "👤"}
          </ProfileImage>
          <Info>
            <Label>Name:</Label> <Value>{user.name}</Value>
          </Info>
          <Info>
            <Label>Email:</Label> <Value>{user.email}</Value>
          </Info>
          <Info>
            <Label>Age:</Label> <Value>{user.age} years</Value>  {/* ✅ Age now correctly fetched */}
          </Info>
          <Info>
            <Label>Gender:</Label> <Value>{user.gender}</Value>
          </Info>
          <Info>
            <Label>Date of Birth:</Label> <Value>{user.dob}</Value>
          </Info>
          <Info>
            <Label>Height:</Label> <Value>{user.height_cm} cm</Value>
          </Info>
          <Info>
            <Label>Weight:</Label> <Value>{user.weight_kg} kg</Value>
          </Info>
        </ProfileCard>

        <Placeholder>🚀 Future Feature: Exercise Log History</Placeholder>
      </Section>
    </Container>
  );
}