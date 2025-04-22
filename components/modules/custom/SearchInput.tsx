import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import Toast from "./Toast";
import { useForm } from "react-hook-form";
import { FormValues, Product } from "@/types";
import Loading from "./Loading";
import { m } from "framer-motion";
import SearchProduct from "./SearchProduct";
import Image from "next/image";
import Link from "next/link";
import CurrencyFormat from "./CurrencyFormat";

export default function SearchInput() {
  const [loading, setLoading] = useState(false);
  const inputSearch = useRef<HTMLInputElement>(null);
  const [dataProducts, setDataProducts] = useState([]);
  const { setFocus } = useForm<FormValues>({
    progressive: true,
  });

  const handleFocusOn = () => {
    inputSearch.current?.focus();
  };

  const handleFocusOff = () => {
    inputSearch.current?.blur();
  };

  useEffect(() => {
    setFocus("search");
  }, [setFocus]);

  const [searchInput, setSearchInput] = useState("");
  /** API SEARCH */
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setSearchInput(e.currentTarget.value);
    const search = e.currentTarget.value;

    if (search.length === 0) setLoading(false);
    if (search.length > 1) {
      await axios
        .get(process.env.NEXT_PUBLIC_API_URL + "/api/product-store-search", {
          params: { name: search },
        })
        .then((response) => {
          const data = response.data;
          console.log(data, "data from search input");
          setDataProducts(data.products);
        })
        .catch((error) => {
          toast.custom(<Toast message={error.message} status="error" />);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const animation = {
    hide: { y: 82, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className={cn("hidden relative w-full group", "lg:block w-full")}>
      <div className=" w-full flex-1 hidden lg:flex group-hover:shadow-xl">
        <Input
          className="appearance-none w-full rounded-sm bg-transparent flex-1 h-[58px] text-[14px]"
          placeholder="Name , Category, Description, Price ...."
          ref={inputSearch}
          onInput={handleSearch}
          onMouseEnter={handleFocusOn}
          onMouseLeave={handleFocusOff}
        />
      </div>

      <m.div
        initial={animation.hide}
        whileInView={animation.show}
        transition={{ delay: 0.3 }}
        className={`hidden absolute z-40 ${
          searchInput?.length >= 2 ? "group-hover:flex" : ""
        }  top-[56px] z-40 rounded-sm w-full bg-white border-neutral-100 border shadow-xl`}
      >
        {loading ? <Loading isLoading={loading} /> : ""}

        <div className="w-full rounded-sm p-4 h-[350px] overflow-y-auto gap-4">
          {dataProducts?.length > 0 &&
            !loading &&
            dataProducts.map((item: Product, idx: number) => (
              <Link
                key={idx}
                className="flex gap-4 w-full border-b hover:shadow-sm p-2 justify-between items-center"
                href={`/products/${item?.product?.slug}`}
              >
                <div className="flex-shrink-0 h-10 w-14 flex items-center justify-center">
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_API_URL +
                      "/storage/" +
                      item?.product?.thumbnail?.file_path
                    }
                    width="56"
                    height="40"
                    alt="product"
                    className="object-cover w-full"
                  />
                </div>

                <div className="text-lg flex gap-2 flex-col w-full font-medium text-gray-800 capitalize">
                  <p> {item?.product?.name.substring(0, 60)}</p>
                </div>
                <div className="text-primary-800 w-full  text-xl font-medium">
                  {/* <CurrencyFormat className="font-bold" value={item?.price} /> */}
                  {item?.product?.unit?.name} {item?.price}
                </div>
                <div className="text-sm font-medium w-full text-gray-500 capitalize">
                  {item?.product?.category.name}
                </div>
              </Link>
            ))}
          {dataProducts?.length === 0 && !loading && (
            <p className="text-center">No products found.</p>
          )}
        </div>
        {/* <SearchProduct
          products={dataProducts}
          className="grid bg-yellow-600 grid-cols-3 gap-8 p-8 min-h-80"
        /> */}
      </m.div>
    </div>
  );
}
