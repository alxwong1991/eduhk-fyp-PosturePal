import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuthStore from "../stores/authStore";
import {
  Container,
  Form,
  FormCard,
  Title,
  Input,
  Select,
  Button,
  LinkText,
} from "../styles/pages/RegisterStyles";

export default function Register() {
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    age: "",
    dob: "",
    height_cm: "",
    weight_kg: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ Utility function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  // ✅ Function to Calculate Age from DOB
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--; // Adjust if the birthday hasn't passed yet this year
    }
    return age;
  };

  // ✅ Handle Input Change (Generalized)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle DOB Change and Auto-Calculate Age
  const handleDobChange = (e) => {
    const dob = e.target.value;
    setFormData((prev) => ({ ...prev, dob, age: calculateAge(dob) }));
  };

  // ✅ Validate Height & Weight
  const validateHeightWeight = () => {
    if (formData.height_cm <= 0 || isNaN(Number(formData.height_cm))) {
      return "Height must be a positive number greater than 0.";
    }
    if (formData.weight_kg <= 0 || isNaN(Number(formData.weight_kg))) {
      return "Weight must be a positive number greater than 0.";
    }
    return null;
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      return Swal.fire({ title: "Error", text: "Passwords do not match", icon: "error" });
    }

    // Validate Height & Weight
    const heightWeightError = validateHeightWeight();
    if (heightWeightError) {
      return Swal.fire({ title: "Error", text: heightWeightError, icon: "error" });
    }

    // Validate DOB
    if (!formData.dob) {
      return Swal.fire({ title: "Error", text: "Please select your date of birth", icon: "error" });
    }

    try {
      await register(formData);

      Swal.fire({ title: "Success", text: "Account created!", icon: "success" })
        .then(() => navigate("/login"));
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
          <Input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />
          <Input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
          <Select name="gender" value={formData.gender} onChange={handleInputChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </Select>
          {/* ✅ Date Picker for DOB */}
          <Input type="date" name="dob" onChange={handleDobChange} value={formData.dob} max={getTodayDate()} required />
          {/* ✅ Show calculated age dynamically */}
          {formData.age && <p>Age: {formData.age} years old</p>}
          <Input type="number" name="height_cm" placeholder="Height (cm)" value={formData.height_cm} onChange={handleInputChange} required />
          <Input type="number" name="weight_kg" placeholder="Weight (kg)" value={formData.weight_kg} onChange={handleInputChange} required />
          <Input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
          <Input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required />
          <Button type="submit">Register</Button>
        </Form>
        <LinkText>
          Already have an account?
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>Login</a>
        </LinkText>
      </FormCard>
    </Container>
  );
}