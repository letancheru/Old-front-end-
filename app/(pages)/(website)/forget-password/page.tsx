import ForgotPassword from "@/components/modules/website/account/ForgotPassword";
import Cart from "@/components/modules/website/cart";
import { Metadata } from "next";
import React from "react";

export default async function page() {
  return <ForgotPassword />;
}

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Become a full stack Nextjs with this project",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};
