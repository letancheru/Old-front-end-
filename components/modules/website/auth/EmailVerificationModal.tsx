"use client";
import React, { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import { X, Mail, RefreshCw } from "lucide-react";
import Loading from "../../custom/Loading";
import Image from "next/image";
import AuthService from "@/components/service/AuthService";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function EmailVerificationModal({ 
  isOpen, 
  onClose,
  onLogin
}: EmailVerificationModalProps) {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const initialValues = {
    code: "",
  };

  const validate = Yup.object({
    code: Yup.string()
      .required("Verification code is required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(6, "Must be exactly 6 digits")
      .max(18, "Must be exactly 18 digits"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (loading) return;
    setLoading(true);

    try {
      await AuthService.verifyEmail(values.code);
      setVerificationSuccess(true);
    } catch (error) {
      console.error("Email verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendLoading) return;
    setResendLoading(true);

    try {
      await AuthService.resendVerificationCode();
    } catch (error) {
      console.error("Resend verification code error:", error);
    } finally {
      setResendLoading(false);
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
            <h2 className="text-2xl font-semibold text-gray-800">Email Verification</h2>
            <p className="text-gray-500 mt-1">
              {verificationSuccess 
                ? "Your email has been verified successfully" 
                : "Enter the verification code sent to your email"}
            </p>
          </div>

          {verificationSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Verification Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your email has been verified successfully. You can now log in to your account.
              </p>
              <button
                onClick={onLogin}
                className="w-full bg-[#1B4486] text-white py-2.5 rounded-lg font-medium hover:bg-[#153567] transition-colors duration-200"
              >
                Proceed to Login
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
                  {/* Verification Code Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Verification Code
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-500 transition-colors" />
                      </div>
                      <Field
                        type="text"
                        name="code"
                        placeholder="Enter verification code"
                        className={cn(
                          "w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 transition-all duration-200 text-gray-700 placeholder-gray-400 bg-gray-50",
                          errors.code && touched.code
                            ? "border-red-500"
                            : "border-gray-200"
                        )}
                      />
                    </div>
                    <ErrorMessage
                      name="code"
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
                    {loading ? "Verifying..." : "Verify Email"}
                  </button>

                  {/* Resend Code */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendLoading}
                      className="text-[#1B4486] hover:text-[#153567] font-medium flex items-center justify-center gap-1 mx-auto"
                    >
                      {resendLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          <span>Resend Code</span>
                        </>
                      )}
                    </button>
                  </div>

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