import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { registerUser } from "../api/auth";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e2a3a 0%, #3d4856 100%);
  color: white;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.07);
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.07);
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  }

  option {
    color: black;
  }
`;

const Button = styled.button`
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #4a90e2;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #357abd;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.7);

  a {
    color: #4a90e2;
    text-decoration: none;
    font-weight: bold;
    margin-left: 0.5rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const validateName = (name) => {
    if (!name.trim()) return "Please enter your name.";
    if (/\s/.test(name)) return "Name cannot contain spaces.";
    if (!/^[a-zA-Z]+$/.test(name))
      return "Name can only contain alphabetic characters.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name
    const nameError = validateName(formData.name);
    if (nameError) {
      Swal.fire({
        title: "Error",
        text: nameError,
        icon: "error",
        confirmButtonText: "Try Again",
      });
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match",
        icon: "error",
        confirmButtonText: "Try Again",
      });
      return;
    }

    // Ensure gender is selected
    if (!formData.gender) {
      Swal.fire({
        title: "Error",
        text: "Please select your gender",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password_hash: formData.password,
        gender: formData.gender,
      });

      Swal.fire({
        title: "Success",
        text: "Account created!",
        icon: "success",
      }).then(() => navigate("/"));
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.detail || "Registration failed",
        icon: "error",
      });
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Create Account</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <Select
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            required
          />
          <Button type="submit">Register</Button>
        </Form>
        <LinkText>
          Already have an account?
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            Login
          </a>
        </LinkText>
      </FormCard>
    </Container>
  );
}
