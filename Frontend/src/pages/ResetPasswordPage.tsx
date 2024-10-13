import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [hasToken, setHasToken] = useState(false); // State to track if a token exists
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Check if token exists
  useEffect(() => {
    const storedToken = localStorage.getItem("token"); // Change 'token' to your actual token key
    setHasToken(!!storedToken); // Set hasToken to true if the token exists
  }, []);


  //be sito neismeta kad .withMessage("Password must meet the following requirements.")
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Request password reset 
  const handlePasswordResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:7000/api/v1/auth/password/request-reset", { email });
      setSuccess("Password reset email has been sent. Please check your inbox.");
      console.log("Password reset email response: ", response.data);
    } catch (err: unknown) {
      console.error("Error response:", err);
      if (err.response && err.response.status === 401) {
        setError("Unauthorized request. Please check your request.");
      } else {
        setError("Failed to send password reset email.");
      }
    }
  };

  // Reset password
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Check if passwords match
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check if the new password meets the required strong password criteria
    if (!passwordRegex.test(password)) {
      setError("Password must meet the following requirements.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:7000/api/v1/auth/password/reset", {
        token,
        password,
        repeat_password: repeatPassword
      });
      setSuccess("Password reset successful! Redirecting to login...");
      console.log("Password reset response: ", response.data);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: unknown) {
      console.error("Error response:", err);
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-1/3 p-6 shadow-lg rounded bg-white">
        <h2 className="text-2xl font-bold mb-4">{isResetting ? "Reset Password" : "Request Password Reset"}</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        {/* Check if token exists and conditionally render forms */}
        {!isResetting ? (
          <>
            {hasToken ? (
              <div className="text-yellow-500 mb-4">You already have a token. Please reset your password.</div> 
            ) : (
              <form onSubmit={handlePasswordResetRequest}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 w-full"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded w-full"
                >
                  Send Reset Email
                </button>
              </form>
            )}
          </>
        ) : (
          <form onSubmit={handlePasswordReset}>
            <div className="mb-4">
              <label htmlFor="token" className="block text-gray-700">Reset Token</label>
              <input
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="mt-1 p-2 border border-gray-300 w-full"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 w-full"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="repeatPassword" className="block text-gray-700">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="repeatPassword"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 w-full"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded w-full"
            >
              Reset Password
            </button>

            <button
              type="button"
              className="mt-2 text-blue-500"
              onClick={() => setIsResetting(false)}
            >
              Back to requesting reset
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
