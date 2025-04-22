"use client";
import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import { X, Mail } from "lucide-react";
import Loading from "../../custom/Loading";
import AuthService from "@/components/service/AuthService";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose, onLogin }: ForgotPasswordModalProps) {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const initialValues = {
    email: "",
  };

  const validate = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (loading) return;
    setLoading(true);

    try {
      await AuthService.forgotPassword(values.email);
      setEmailSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] p-0 bg-white rounded-xl">
        {loading && <Loading isLoading={loading} />}
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Forgot Password</h2>
            <p className="text-gray-500 mt-1">Enter your email to reset your password</p>
          </div>

          {emailSent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Email Sent!</h3>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>
              <button
                onClick={onLogin}
                className="text-[#1B4486] hover:text-[#153567] font-medium"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={validate}
              onSubmit={handleSubmit}
            >
              {({ errors, touched }) => (
                <Form className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                      </div>
                      <Field
                        type="email"
                        name="email"
                        placeholder="user@example.com"
                        className={cn(
                          "w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50",
                          errors.email && touched.email
                            ? "border-red-500"
                            : "border-gray-200"
                        )}
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1B4486] text-white py-2.5 rounded-lg font-medium hover:bg-[#153567] transition-colors duration-200 mt-2 disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>

                  {/* Back to Login */}
                  <div className="text-center text-sm mt-4">
                    <button
                      type="button"
                      onClick={onLogin}
                      className="text-[#1B4486] hover:text-[#153567] font-medium"
                    >
                      Back to Login
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 