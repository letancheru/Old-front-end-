"use client";
import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import { X, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import Loading from "../../custom/Loading";
import AuthService from "@/components/service/AuthService";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useUser } from "@/contexts/UserContext";
import { User } from "@/types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
  onForgotPassword: () => void;
  onLoginSuccess?: (userData: any) => void;
}

export default function LoginModal({ isOpen, onClose, onRegister, onForgotPassword, onLoginSuccess }: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser } = useUser() as { setUser: (user: User | null) => void };

  const initialValues = {
    email: "",
    password: "",
  };

  const validate = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    password: Yup.string()
      .required("Password is required"),
  });

  const handleSave = async (values: typeof initialValues) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await AuthService.login(values.email, values.password);
      // Update the UserContext state with the user data
      setUser(response.user);
      
      // Call the onLoginSuccess callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(response.user);
      }
      
      onClose();
      router.push("/");
    } catch (error) {
      console.error("Login error:", error);
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
            <h2 className="text-2xl font-semibold text-gray-800">Welcome!</h2>
            <p className="text-gray-500 mt-1">Please Login to continue</p>
          </div>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validate}
            onSubmit={handleSave}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email / Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                    </div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="user@readyecommerce.com"
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

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1B4486] text-white py-2.5 rounded-lg font-medium hover:bg-[#153567] transition-colors duration-200 mt-2 disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Log in"}
                </button>

                {/* Register Link */}
                <div className="text-center text-sm mt-4">
                  <span className="text-gray-600">Don't have an account? </span>
                  <button
                    type="button"
                    onClick={onRegister}
                    className="text-[#1B4486] hover:text-[#153567] font-medium"
                  >
                    Sign Up
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