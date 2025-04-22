"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/components/service/AuthService";
import Container from "@/components/modules/custom/Container";
import SidebarAccount from "@/components/modules/website/account/SidebarAccount";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const user = AuthService.getUser();
    if (!user) {
      router.push("/");
    }
  }, [router]);

  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <Container>
        <div className="flex gap-6">
          {/* Sidebar */}
          <SidebarAccount />

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg p-6">
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}
