import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useForm } from "react-hook-form";
import { FormValues, Product } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";
import Toast from "./Toast";
import Loading from "./Loading";
import { m } from "framer-motion";
import SearchProduct from "./SearchProduct";
import Image from "next/image";
import Link from "next/link";
import CurrencyFormat from "./CurrencyFormat";

export default function SearchMobile({
  openSearchMobile,
  setOpenSearchMobile,
}: {
  openSearchMobile: boolean;
  setOpenSearchMobile: (value: boolean) => void;
}) {
  const inputSearch = useRef<HTMLInputElement>(null);
  const { setFocus } = useForm<FormValues>({
    progressive: true,
  });

  const [loading, setLoading] = useState(false);
  const [dataProducts, setDataProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const handleFocusOn = () => {
    inputSearch.current?.focus();
  };

  const handleFocusOff = () => {
    inputSearch.current?.blur();
  };

  useEffect(() => {
    setFocus("search");
  }, [setFocus]);

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
          console.log(data, "data from search mobile");
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
    <>
      <button
        className={cn("", openSearchMobile && "hidden")}
        onClick={() => setOpenSearchMobile(!openSearchMobile)}
      >
        <CiSearch className="h-8 w-8" />
      </button>
      <m.div
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "hidden hover:shadown-xl rounded-md bg-white w-full",
          openSearchMobile && "flex lg:hidden justify-between items-center "
        )}
      >
        <form className="flex items-center gap-4 w-full">
          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              setOpenSearchMobile(false);
              setLoading(false);
            }}
          >
            <ChevronLeft className="" />
          </Button>

          <Input
            className="focus:outline-none  focus:visible-none text-[16px] focus:ring-0 appearance-none ring-white bg-transparent flex-1 "
            placeholder="Name , Category, Description, Price ...."
            ref={inputSearch}
            onInput={handleSearch}
            onMouseEnter={handleFocusOn}
            onMouseLeave={handleFocusOff}
          />
        </form>
        <m.div
          initial={animation.hide}
          whileInView={animation.show}
          transition={{ delay: 0.3 }}
          className={`absolute ${
            searchInput?.length >= 2 ? "group-hover:flex" : "hidden"
          } top-[50px] z-20 rounded-t-xl w-full bg-white border-neutral-100 border shadow-xl`}
        >
          {loading ? <Loading isLoading={loading} /> : ""}

          <div className="w-full rounded-xl p-4 h-[350px] overflow-y-auto gap-4">
            {dataProducts?.length > 0 &&
              !loading &&
              dataProducts.map((item: Product, idx: number) => (
                <Link
                  key={idx}
                  className="flex gap-4 w-full border-b hover:shadow-md p-2 justify-between items-center"
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
                  <div className="text-primary-800 w-full text-xl font-medium">
                    {/* <CurrencyFormat className="font-bold" value={item?.price} /> */}
                    {item?.product?.unit?.name} {item?.price}
                  </div>
                  <div className="text-sm font-medium w-full text-gray-500 capitalize">
                    {item?.product?.category.name}
                  </div>
                </Link>
              ))}{" "}
            {dataProducts?.length === 0 && !loading && (
              <p className="text-center">No products found.</p>
            )}
          </div>
        </m.div>
        {/* <SearchProduct
          products={dataProducts}
          className="absolute grid grid-cols-2 gap-4 place-content-center justify-items-center overflow-auto w-full top-[60px] left-0 h-auto shadow-sm z-20 p-4 bg-white md:grid-cols-3"
        /> */}
      </m.div>
    </>
  );
}
