"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const token = searchParams.get("token");
  const email = localStorage?.getItem("elelan_forget_email");

  useEffect(() => {
    if (!token && !email) {
      setMessage({
        type: "error",
        text: "Invalid reset link. Please request a new password reset.",
      });
    }
  }, [token, email]);

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (!token && !email) return;

  //   setLoading(true);
  //   setMessage({ type: "", text: "" });

  //   try {
  //     const result = await authService.resetPassword({
  //       email,
  //       token,
  //       password: formData.password,
  //       password_confirmation: formData.password_confirmation,
  //     });

  //     setMessage({
  //       type: result.success ? "success" : "error",
  //       text: result.message,
  //     });

  //     if (result.success) {
  //       setTimeout(() => {
  //         router.push("/auth/signin");
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     setMessage({
  //       type: "error",
  //       text: "An unexpected error occurred. Please try again.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token && !email) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/api/reset-password",
        {
          email,
          token,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }
      );

      if (response.data) {
        setMessage({
          type: response?.data?.status === "success" ? "success" : "error",
          text: response?.data.message,
        });
      }

      if (response?.data?.status === "success") {
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message
          ? error.message
          : "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 animate-gradient bg-[length:400%_400%]">
      <div className="flex items-center justify-center min-h-screen px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="mb-8 text-center">
              <span className="text-3xl font-bold text-gray-800">
                Reset Password
              </span>
            </h2>

            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-600"
                    : "bg-red-50 border border-red-200 text-red-500"
                }`}
              >
                <p className="text-center font-medium">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <button
                  type="submit"
                  disabled={loading && !token && !email}
                  className="w-full rounded-lg bg-gradient-to-r from-primary-600 to-orange-500 p-4 font-bold text-white transition hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Resetting...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/auth/signin")}
                  className="w-full rounded-lg border border-primary p-4 font-bold text-primary transition hover:bg-primary/5"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
