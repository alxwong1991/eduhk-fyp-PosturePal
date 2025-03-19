import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../components/Logo";
import { loginUser } from "../api/auth";
import { Container, FormCard, Title, Form, Input, Button, LinkText, LogoSection } from "../styles/pages/LoginStyles";

export default function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add your login logic here
    try {
      await loginUser(formData);
      Swal.fire({
        title: "Success",
        text: "Login successful!",
        icon: "success",
      }).then(() => {
        console.log("Dispatching storage event after login...");
        window.dispatchEvent(new Event("storage"));
        navigate("/dashboard");
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Invalid credentials: " + error,
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <Container>
      <LogoSection>
        <Logo onClick={() => navigate("/")} large />
      </LogoSection>
      {/* For debugging */}
      <Button onClick={() => navigate("/dashboard")}>Debug</Button>
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
