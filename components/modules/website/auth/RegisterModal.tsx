"use client";
import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import { X, Eye, EyeOff, Mail, User, Lock, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import Loading from "../../custom/Loading";
import AuthService from "@/components/service/AuthService";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onEmailVerification: () => void;
}

export default function RegisterModal({ isOpen, onClose, onLogin, onEmailVerification }: RegisterModalProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  };

  const validate = Yup.object({
    first_name: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters"),
    last_name: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^\+?[1-9][0-9]{7,14}$/, "Invalid phone number"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    password_confirmation: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  const router = useRouter();

  const handleSubmit = async (values: typeof initialValues) => {
    if (loading) return;
    setLoading(true);

    try {
      await AuthService.register(values);
      onEmailVerification();
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] p-0 bg-white rounded-xl overflow-hidden">
        {loading && <Loading isLoading={loading} />}
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content */}
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-1">Join us to start shopping</p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validate}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                {/* First Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                    </div>
                    <Field
                      type="text"
                      name="first_name"
                      placeholder="John"
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50",
                        errors.first_name && touched.first_name
                          ? "border-red-500"
                          : "border-gray-200"
                      )}
                    />
                  </div>
                  <ErrorMessage
                    name="first_name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Last Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                    </div>
                    <Field
                      type="text"
                      name="last_name"
                      placeholder="Doe"
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50",
                        errors.last_name && touched.last_name
                          ? "border-red-500"
                          : "border-gray-200"
                      )}
                    />
                  </div>
                  <ErrorMessage
                    name="last_name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

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

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                    </div>
                    <Field
                      type="text"
                      name="phone"
                      placeholder="+1234567890"
                      className={cn(
                        "w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50",
                        errors.phone && touched.phone
                          ? "border-red-500"
                          : "border-gray-200"
                      )}
                    />
                  </div>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                    </div>
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      className={cn(
                        "w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50",
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-gray-200"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                    </div>
                    <Field
                      type={showConfirmPassword ? "text" : "password"}
                      name="password_confirmation"
                      placeholder="••••••••"
                      className={cn(
                        "w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50",
                        errors.password_confirmation && touched.password_confirmation
                          ? "border-red-500"
                          : "border-gray-200"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password_confirmation"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1B4486] text-white py-2.5 rounded-lg font-medium hover:bg-[#153567] transition-colors duration-200 mt-2 disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>

                {/* Login Link */}
                <div className="text-center text-sm mt-4">
                  <span className="text-gray-600">Already have an account? </span>
                  <button
                    type="button"
                    onClick={onLogin}
                    className="text-[#1B4486] hover:text-[#153567] font-medium"
                  >
                    Log in
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </DialogContent>
    </Dialog>
  );
} 