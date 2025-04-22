'use client';
import React, { useState, useRef } from 'react';
import axiosInstance from '@/components/axiosInstance/AxiosInstance';
import toast from 'react-hot-toast';
import GlobalLoading from '@/components/Loading/GlobalLoading';

const PasswordUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const validatePassword = (password: string): string | null => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLongEnough = password.length >= 8;

    if (!isLongEnough) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)';
    }
    if (!hasNumber) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationErrors({});
  
    try {
      const formData = new FormData(e.currentTarget);
      const currentPassword = formData.get('current_password') as string;
      const newPassword = formData.get('new_password') as string;
      
      // Check if new password is same as current password
      if (currentPassword === newPassword) {
        setValidationErrors({
          new_password: ['New password cannot be the same as your current password']
        });
        setIsLoading(false);
        return;
      }

      // Validate new password
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        setValidationErrors({
          new_password: [passwordError]
        });
        setIsLoading(false);
        return;
      }

      const passwordData = {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: formData.get('new_password_confirmation') as string,
      };
  
      const response = await axiosInstance.put('/api/profile/change-password', passwordData);
      toast.success(response.data?.message || 'Your password has been updated successfully');
      
      // Reset form after successful update
      if (formRef.current) {
        formRef.current.reset();
      }
      setValidationErrors({});
    } catch (error: any) {
      if (error.response?.status === 422 && error.response?.data?.errors) {
        setValidationErrors(error.response.data.errors);
      } else if (error.response?.status === 401) {
        toast.error('Your current password is incorrect. Please try again.');
      } else {
        toast.error('Failed to update password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (fieldName: string) => {
    return validationErrors[fieldName]?.[0];
  };

  return (
    <>
      {isLoading && <GlobalLoading />}
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg dark:bg-boxdark dark:shadow-none border border-gray-200 dark:border-strokedark overflow-hidden">
          <div className="bg-gradient-to-r from-[#053F6E] to-[#053F6E]/80 p-6 border-b border-gray-200 dark:border-strokedark">
            <h2 className="text-2xl font-bold text-white">
              Change Password
            </h2>
            <p className="text-sm text-white/80 mt-1">Update your account password</p>
          </div>

          <div className="p-6">
            <form ref={formRef} onSubmit={handlePasswordUpdate} className="space-y-6">
              {/* Current Password Field */}
              <div>
                <label htmlFor="current_password" className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Current Password <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    id="current_password"
                    name="current_password"
                    type="password"
                    placeholder="Enter your current password"
                    disabled={isLoading}
                    className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 px-4 font-medium outline-none transition-all duration-300 focus:border-[#053F6E] focus:ring-2 focus:ring-[#053F6E]/20 hover:border-[#053F6E]/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#053F6E] dark:focus:ring-[#053F6E]/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                  />
                </div>
                {validationErrors.current_password && (
                  <p className="text-danger mt-2 text-sm">{getErrorMessage('current_password')}</p>
                )}
              </div>

              {/* New Password Field */}
              <div>
                <label htmlFor="new_password" className="mb-2 block text-sm font-medium text-black dark:text-white">
                  New Password <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    id="new_password"
                    name="new_password"
                    type="password"
                    placeholder="Enter new password"
                    disabled={isLoading}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 px-4 font-medium outline-none transition-all duration-300 focus:border-[#053F6E] focus:ring-2 focus:ring-[#053F6E]/20 hover:border-[#053F6E]/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#053F6E] dark:focus:ring-[#053F6E]/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                  />
                </div>
                {validationErrors.new_password && (
                  <p className="text-danger mt-2 text-sm">{getErrorMessage('new_password')}</p>
                )}
                {isPasswordFocused && (
                  <div className="mt-2 p-3 bg-gray-50 dark:bg-boxdark-2 rounded-lg border border-gray-200 dark:border-strokedark">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password must contain:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li>At least 8 characters</li>
                      <li>At least one uppercase letter</li>
                      <li>At least one lowercase letter</li>
                      <li>At least one number</li>
                      <li>At least one special character (!@#$%^&amp;*(),.?&quot;:{}|&lt;&gt;)</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm New Password Field */}
              <div>
                <label htmlFor="new_password_confirmation" className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Confirm New Password <span className="text-danger">*</span>
                </label>
                <div className="relative">
                  <input
                    id="new_password_confirmation"
                    name="new_password_confirmation"
                    type="password"
                    placeholder="Confirm new password"
                    disabled={isLoading}
                    className="w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 px-4 font-medium outline-none transition-all duration-300 focus:border-[#053F6E] focus:ring-2 focus:ring-[#053F6E]/20 hover:border-[#053F6E]/50 dark:border-form-strokedark dark:bg-form-input dark:focus:border-[#053F6E] dark:focus:ring-[#053F6E]/30 disabled:cursor-default disabled:bg-whiter dark:disabled:bg-black/30"
                  />
                </div>
                {validationErrors.new_password_confirmation && (
                  <p className="text-danger mt-2 text-sm">{getErrorMessage('new_password_confirmation')}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex justify-center rounded-lg bg-[#053F6E] px-6 py-2.5 font-medium text-white transition-all duration-300 hover:bg-[#053F6E]/90 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordUpdate; 