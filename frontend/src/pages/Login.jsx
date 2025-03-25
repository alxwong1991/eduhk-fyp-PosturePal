import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../components/Logo";
import useAuthStore from "../stores/authStore";
import {
  Container,
  FormCard,
  Title,
  Form,
  Input,
  Button,
  LinkText,
  LogoSection,
} from "../styles/pages/LoginStyles";

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      Swal.fire({
        title: "Success",
        text: "Login successful!",
        icon: "success",
      }).then(() => {
        window.dispatchEvent(new Event("storage"));
        navigate("/dashboard");
      });
    } catch (error) {
      Swal.fire("Error", "Invalid credentials: " + error, "error");
    }
  };

  return (
    <Container>
      <LogoSection>
        <Logo onClick={() => navigate("/")} large />
      </LogoSection>

      <FormCard>
        <Title>Welcome Back</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <Button type="submit">Login</Button>

          <Button
            type="button"
            onClick={() => navigate("/dashboard")}
            style={{ backgroundColor: "#666", marginTop: "10px" }}
          >
            Return to Dashboard
          </Button>
        </Form>

        <LinkText>
          Don't have an account?
          <a
            href="/register"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            Register
          </a>
        </LinkText>
      </FormCard>
    </Container>
  );
}
