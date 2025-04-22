"use client";
import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import EmailVerificationModal from './EmailVerificationModal';

type ModalType = 'login' | 'register' | 'forgotPassword' | 'emailVerification' | null;

interface AuthModalsProps {
  isOpen: boolean;
  initialModal?: ModalType;
  onClose: () => void;
  onLoginSuccess?: (userData: any) => void;
}

export default function AuthModals({ isOpen, initialModal = 'login', onClose, onLoginSuccess }: AuthModalsProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(isOpen ? initialModal : null);

  useEffect(() => {
    if (isOpen) {
      setActiveModal(initialModal);
    } else {
      setActiveModal(null);
    }
  }, [isOpen, initialModal]);

  const handleClose = () => {
    setActiveModal(null);
    onClose();
  };

  return (
    <>
      <LoginModal
        isOpen={activeModal === 'login'}
        onClose={handleClose}
        onRegister={() => setActiveModal('register')}
        onForgotPassword={() => setActiveModal('forgotPassword')}
        onLoginSuccess={onLoginSuccess}
      />
      
      <RegisterModal
        isOpen={activeModal === 'register'}
        onClose={handleClose}
        onLogin={() => setActiveModal('login')}
        onEmailVerification={() => setActiveModal('emailVerification')}
      />
      
      <ForgotPasswordModal
        isOpen={activeModal === 'forgotPassword'}
        onClose={handleClose}
        onLogin={() => setActiveModal('login')}
      />
      
      <EmailVerificationModal
        isOpen={activeModal === 'emailVerification'}
        onClose={handleClose}
        onLogin={() => setActiveModal('login')}
      />
    </>
  );
} 