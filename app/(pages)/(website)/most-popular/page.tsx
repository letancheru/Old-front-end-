"use client";
import Container from "@/components/modules/custom/Container";
import ProductsPage from "@/components/modules/website/products/ProductsPage";
import React from "react";

export default function MostPopular() {
  return (
    <section className="my-6 h-full w-full">
      <Container>
        <ProductsPage />
      </Container>
    </section>
  );
}
