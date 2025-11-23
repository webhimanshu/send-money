import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {  
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Account created successfully, please login to continue");
        navigate("/login");
      } else {
        console.log(data.message);
        toast.error("Something went wrong, please try again");
      }
    } catch (error) {
      toast.error("An error occurred, please try again");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Signup Form */}
          <div className="w-full">
            <h2 className="text-3xl font-semibold text-center mb-10 text-gray-900">
              SignUp!
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoFocus
                  className="w-full px-4 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-blue-900 transition-colors"
                />
              </div>

              <div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-blue-900 transition-colors"
                />
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-blue-900 transition-colors"
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-blue-900 transition-colors"
                />
              </div>

              <div className="text-center text-gray-600 pt-4">
                Already a member?{" "}
                <Link
                  to="/login"
                  className="text-blue-900 hover:text-blue-950 font-medium underline"
                >
                  Login
                </Link>
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer bg-blue-900 hover:bg-blue-950 text-white font-semibold py-3 px-4 mt-8 rounded-lg transition-colors duration-200"
              >
                SignUp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
