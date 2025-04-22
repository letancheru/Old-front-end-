"use client";
import React, { useEffect, useState } from "react";
import Heading from "../../custom/Heading";
import CategoriesAccordion from "../../custom/CategoriesAccordion";
import FiltersPrice from "../../custom/FiltersPrice";
import LatestProducts from "./LatestProducts";
import { Category } from "@/types";
import axios from "axios";

export default function SidebarLeft({
  minPrice,
  maxPrice,
  // loading,
  setMinPrice,
  setMaxPrice,
}: {
  minPrice: number;
  maxPrice: number;
  loading: boolean;
  setMinPrice: (value: number) => void;
  setMaxPrice: (value: number) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>();

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      await axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/api/categories")
        .then((response) => {
          setCategories(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    getCategories();
  }, []);

  return (
    <div className="max-w-[280px] w-full flex-col gap-8 h-full hidden xl:flex">
      {/* categories  */}
      <div className="flex flex-col w-full -mt-5 relative">
        {/* <Heading name="browser categories" /> */}
        {/* <div className="flex w-full my-4"> */}
        <CategoriesAccordion categories={categories} loading={loading} />
        {/* </div> */}
      </div>

      {/* filters */}
      <div className="flex flex-col w-full relative">
        <Heading name="filters" />
        <div className="flex my-4">
          <FiltersPrice
            loading={loading}
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
          />
        </div>
      </div>

      {/* Latest products */}

      <div className="flex flex-col w-full relative">
        <Heading name="latest products" />
        <div className="flex-flex-col my-4">
          <LatestProducts />
        </div>
      </div>
    </div>
  );
}
