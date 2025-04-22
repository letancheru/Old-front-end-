import ForgotPassword from "@/components/modules/website/account/ForgotPassword";
import ResetPassword from "@/components/modules/website/account/ResetPassword";
import Cart from "@/components/modules/website/cart";
import { Metadata } from "next";
import React from "react";

export default async function page() {
  return <ResetPassword />;
}

export const metadata: Metadata = {
  title: "Reset password",
  description: "Become a full stack Nextjs with this project",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};
