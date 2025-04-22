"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "/api/forgot-password",
        { email }
      );

      if (response.data) {
        setMessage({
          type: response?.data?.status === "success" ? "success" : "error",
          text: response?.data.message,
        });
      }

      localStorage.setItem("elelan_forget_email", email);
      // if (response?.data?.success) {
      //   setTimeout(() => {
      //     router.push("/auth/signin");
      //   }, 3000);
      // }
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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 animate-gradient bg-[length:400%_400%]">
      <div className="flex items-center justify-center min-h-screen px-4 py-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="mb-8 text-center">
              <span className="text-3xl font-bold text-gray-800">
                Forgot Password
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

            <form onSubmit={handleSubmit} method="POST" className="space-y-6">
              <div>
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  />
                  <span className="absolute right-4 top-4">
                    <svg
                      className="fill-current"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                    >
                      <g opacity="0.5">
                        <path d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z" />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <button
                  type="submit"
                  disabled={loading}
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
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link"
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

export default ForgotPassword;
