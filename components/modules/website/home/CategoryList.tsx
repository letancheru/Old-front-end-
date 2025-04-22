"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loading from "../../custom/Loading";
import { Category, SubCategory } from "@/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import CategoriesAccordion from "../../custom/CategoriesAccordion";

export default function CategoryList({ className }: { className: string }) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  // get api
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
    <div id="categoryList" className={`flex flex-col gap-4 p-4 ${className}`}>
      {/* {loading && <Loading isLoading={loading} />} */}

      <CategoriesAccordion categories={categories} loading={loading} />
    </div>
  );
}
