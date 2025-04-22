"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { m } from "framer-motion";
import axios from "axios";

const VerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !verificationCode) return;

    try {
      setLoading(true);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "api/verify-email",
        {
          email,
          code: verificationCode,
        }
      );

      Swal.fire({
        title: "Success!",
        text: response.data.message || "Email verified successfully",
        icon: "success",
        confirmButtonColor: "#3b82f6",
      }).then(() => {
        router.push("/auth/signin");
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to verify email",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    try {
      setResendLoading(true);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + "api/resend-verification-code",
        {
          email,
        }
      );

      Swal.fire({
        title: "Success!",
        text: response.data.message || "Verification code sent successfully",
        icon: "success",
        confirmButtonColor: "#3b82f6",
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message || "Failed to resend verification code",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Invalid Verification Link
            </h2>
            <p className="text-gray-600">
              This verification link is invalid or has expired. Please request a
              new verification code.
            </p>
          </div>
          <button
            onClick={() => router.push("/auth/signin")}
            className="w-full bg-primary text-white py-3 px-4 rounded-xl hover:bg-primary/90 transition-all duration-200 transform hover:scale-[1.02] font-medium"
          >
            Return to Sign In
          </button>
        </m.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600">
            We've sent a verification code to{" "}
            <span className="font-medium text-gray-800">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="verificationCode"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Verification Code
            </label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-4 rounded-xl hover:bg-primary/90 transition-all duration-200 transform hover:scale-[1.02] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
                Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={resendLoading}
            className="w-full text-primary border-2 border-primary py-3 px-4 rounded-xl hover:bg-primary/5 transition-all duration-200 transform hover:scale-[1.02] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? "Sending..." : "Resend Verification Code"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/auth/signin")}
            className="w-full text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            Back to Sign In
          </button>
        </form>
      </m.div>
    </div>
  );
};

export default VerifyEmail;
