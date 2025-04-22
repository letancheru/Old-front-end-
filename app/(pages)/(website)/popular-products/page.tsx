"use client";
import Container from "@/components/modules/custom/Container";
import MostPopularProductsPage from "@/components/modules/website/MostPopularProductsPage";
import React from "react";

export default function PopularProducts() {
  return (
    <section className="my-6 h-full w-full">
      <Container>
        <MostPopularProductsPage />
      </Container>
    </section>
  );
}
