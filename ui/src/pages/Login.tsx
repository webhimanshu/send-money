import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvider";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
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
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        const user = {
          firstName: data.data.user.firstName,
          lastName: data.data.user.lastName,
          email: data.data.user.email
        }
        auth.login(data.data.token, user)
        toast.success("Login successful, redirecting to dashboard");
        navigate("/dashboard");
      } else {
        console.log(data.message);
        toast.error(data.message || "Something went wrong, please try again");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please try again");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login Form */}
          <div className="w-full">
            <h2 className="text-3xl font-semibold text-center mb-10 text-gray-900">
              Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-blue-900 hover:text-blue-950 font-medium underline"
                >
                  SignUp
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-950 text-white font-semibold py-3 px-4 mt-8 rounded-lg transition-colors duration-200"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
