import useAuthStore from "../stores/authStore";
import NavMenu from "../components/NavMenu";
import ShowExerciseLog from "../components/ShowExerciseLog";
import ShowGoalTracker from "../components/ShowGoalTracker"; 
import {
  Container,
  ProfileCard,
  ProfileImage,
  Info,
  Label,
  Value,
  Section,
  SectionHeader,
} from "../styles/pages/ProfileStyles";

export default function Profile() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <Container>Loading profile...</Container>;
  }

  if (!user) {
    return <Container>No user data available.</Container>;
  }

  return (
    <Container>
      <NavMenu />
      <ShowGoalTracker />
      <Section>
        {/* ✅ Profile Section */}
        <SectionHeader>Profile Information</SectionHeader>
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
            <Label>Age:</Label> <Value>{user.age} years</Value>
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

        {/* ✅ Exercise Log Section */}
        <SectionHeader>Exercise Log History</SectionHeader>
        <ShowExerciseLog />
      </Section>
    </Container>
  );
}