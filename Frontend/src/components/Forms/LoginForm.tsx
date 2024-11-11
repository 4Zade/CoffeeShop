import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { checkAuth, toggle } = useAuth();

  const onSubmit = async (data: { email: string; password: string; rememberMe: boolean }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:7000/api/v1/auth/login",
        {
          email: data.email,
          password: data.password,
          remember: data.rememberMe,
        },
        { withCredentials: true }
      );

      checkAuth();
      toggle()
    } catch (err: any) {
      if (err.response) {
        console.error("Response error:", err.response.data);
        if (err.response.data.errors) {
          const errorMessages = err.response.data.errors
            .map((err: any) => err.msg)
            .join(", ");
          setError(errorMessages);
        } else {
          setError(err.response.data.message || "An error occurred.");
        }
      } else {
        console.error("Error message:", err.message);
        setError("An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full p-6 shadow-lg rounded bg-slate-200 dark:bg-zinc-800"
      >
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="">
          <label htmlFor="email" className="block text-black dark:text-white">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Email is required." })}
            className="mt-1 p-2 border border-slate-300 dark:border-zinc-900 bg-slate-100 dark:bg-zinc-900 w-full"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div className="">
          <label htmlFor="password" className="block text-black dark:text-white">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", { required: "Password is required." })}
              className="mt-1 p-2 border border-slate-300 dark:border-zinc-900 bg-slate-100 dark:bg-zinc-900 w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <div className="text-center mt-4">
          <Link to="/reset-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <div className="mb-4 flex items-center justify-center">
          <input
            type="checkbox"
            id="rememberMe"
            {...register("rememberMe")}
            className="mr-2"
          />
          <label htmlFor="rememberMe" className="text-gray-700">
            Remember Me
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
  );
}
