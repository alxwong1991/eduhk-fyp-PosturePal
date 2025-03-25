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
  const {register} = useAuthStore();
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

  // const validateName = (name) => {
  //   if (!name.trim()) return "Please enter your name.";
  //   if (/\s/.test(name)) return "Name cannot contain spaces.";
  //   if (!/^[a-zA-Z]+$/.test(name))
  //     return "Name can only contain alphabetic characters.";
  //   return null;
  // };

  // // Validate name
  // const nameError = validateName(formData.name);
  // if (nameError) {
  //   Swal.fire({
  //     title: "Error",
  //     text: nameError,
  //     icon: "error",
  //     confirmButtonText: "Try Again",
  //   });
  //   return;
  // }

  // // Ensure gender is selected
  // if (!formData.gender) {
  //   Swal.fire({
  //     title: "Error",
  //     text: "Please select your gender",
  //     icon: "error",
  //     confirmButtonText: "OK",
  //   });
  //   return;
  // }

  // ✅ Function to Get Today's Date in YYYY-MM-DD Format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Formats as YYYY-MM-DD
  };

  // ✅ Function to Calculate Age from DOB
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--; // Adjust age if the birthdate hasn't occurred yet this year
    }
    return age;
  };

  // ✅ Handle DOB Change and Auto-Calculate Age
  const handleDobChange = (e) => {
    const dob = e.target.value;
    const calculatedAge = calculateAge(dob);
    setFormData({ ...formData, dob, age: calculatedAge });
  };

  // ✅ Validate Height & Weight
  const validateHeightWeight = () => {
    if (formData.height_cm <= 0 || isNaN(formData.height_cm)) {
      return "Height must be a positive number greater than 0.";
    }
    if (formData.weight_kg <= 0 || isNaN(formData.weight_kg)) {
      return "Weight must be a positive number greater than 0.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // Validate Height & Weight
    const heightWeightError = validateHeightWeight();
    if (heightWeightError) {
      Swal.fire({
        title: "Error",
        text: heightWeightError,
        icon: "error",
        confirmButtonText: "Try Again",
      });
      return;
    }

    // Validate DOB
    if (!formData.dob) {
      Swal.fire({
        title: "Error",
        text: "Please select your date of birth",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // await register({
      //   name: formData.name,
      //   email: formData.email,
      //   password: formData.password,
      //   gender: formData.gender,
      //   age: formData.age,
      //   dob: formData.dob,
      //   height_cm: formData.height_cm,
      //   weight_kg: formData.weight_kg,
      // });

      await register(formData);

      Swal.fire({
        title: "Success",
        text: "Account created!",
        icon: "success",
      }).then(() => navigate("/login"));
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
          </Select>
          {/* ✅ Date Picker for DOB */}
          <Input
            type="date"
            onChange={handleDobChange}
            value={formData.dob}
            max={getTodayDate()}
            required
          />
          {/* ✅ Show calculated age dynamically */}
          {formData.age && <p>Age: {formData.age} years old</p>}
          <Input
            type="number"
            placeholder="Height (cm)"
            value={formData.height_cm}
            onChange={(e) =>
              setFormData({ ...formData, height_cm: e.target.value })
            }
            required
          />
          <Input
            type="number"
            placeholder="Weight (kg)"
            value={formData.weight_kg}
            onChange={(e) =>
              setFormData({ ...formData, weight_kg: e.target.value })
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
              navigate("/login");
            }}
          >
            Login
          </a>
        </LinkText>
      </FormCard>
    </Container>
  );
}
