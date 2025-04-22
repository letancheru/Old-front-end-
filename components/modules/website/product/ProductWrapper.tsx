"use client";
import React, { useState } from "react";
import Container from "../../custom/Container";
import ProductImage from "./ProductImage";
import ProductContent from "./ProductContent";
import { Product } from "@/types";

export default function ProductWrapper({ product }: { product: Product }) {
  const [active, setActive] = useState<number>(0);
  const [images, setImages] = useState<string[]>(product?.media);

  return (
    <section className="my-20">
      {/* <Container> */}
        <div className="flex w-full bg-red-500 flex-wrap  justify-between gap-2 lg:flex-nowrap">
          <ProductImage
            className="text-center w-full bg-yellow-500 max-w-2xld"
            product={product}
            images={images}
            active={active}
          />
          <ProductContent
            className="flex-1 bg-green-500 w-full"
            product={product}
            active={active}
            setImages={setImages}
            setActive={setActive}
          />
        </div>
      {/* </Container> */}
    </section>
  );
}
