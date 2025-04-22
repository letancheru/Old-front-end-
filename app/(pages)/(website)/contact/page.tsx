import ContactForm from "@/components/modules/website/contact/ContactForm";
import Breadcrumb from "@/components/modules/custom/Breadcrumb";
import { Metadata } from "next";
import React from "react";
import Partner from "@/components/modules/website/home/Partner";

export default async function page() {
  return (
    <>
      <Breadcrumb 
        items={[
          { label: "contact" }
        ]} 
      />
      <div className="my-10">
        <ContactForm />
        <Partner /> 
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "Contact",
  description: "Become a full stack Nextjs with this project",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};
