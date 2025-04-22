import usePagination from "@/hooks/usePagination";
import axios from "axios";
import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import ProductList from "./ProductList";
import { Pagination } from "@mui/material";
import { useBranch } from "@/contexts/BranchContext";
import { usePathname } from "next/navigation";
import ProductCardSkeleton from "../home/ProductCardSkeleton";

export default function ShopProducts({
  loading,
  setLoading,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  slug,
}: {
  loading: boolean;
  slug?: string;
  setLoading: (value: boolean) => void;
  setMaxPrice: (value: number) => void;
  setMinPrice: (value: number) => void;
  minPrice: number;
  maxPrice: number;
}) {
  const [products, setProducts] = useState([]);
  const [perpage, setPerPages] = useState(10);
  const [filter, setFilter] = useState("latest");

  const pathname = usePathname();
  const [page, setPage] = useState(1);

  const count = Math.ceil(products.length / perpage);
  const _DATA = usePagination(products, perpage);

  const handleChange = (e: React.ChangeEvent<unknown>, p: number) => {
    setPage(p);
    _DATA.jump(p);
  };

  const { branch } = useBranch();

  useEffect(() => {
    const getProducts = () => {
      setLoading(true);
      axios
        .get(process.env.NEXT_PUBLIC_API_URL + `/api/product-stores`, {
          params: {
            // filter: filter,
            slug: slug,
            ...(branch ? { store_id: branch } : ""),
            ...(pathname === "/hot-selling/" ? { discount: 20 } : ""),
            ...(pathname === "/best-reviewed/" ? { rating: 3.5 } : ""),
            min_price: pathname === "/most-popular/" ? 350 : minPrice,
            max_price: maxPrice,
          },
        })
        .then((response) => {
          setProducts(response?.data?.data);
        })
        .catch((error) => {
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getProducts();
  }, [page, filter, slug, minPrice, maxPrice, setLoading, branch]);

  console.log(pathname, "pathname from shop products");
  return (
    <div>
      <TopBar
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        loading={loading}
        slug={slug}
        perpage={perpage}
        filter={filter}
        setPerPages={setPerPages}
        setFilter={setFilter}
      />

      {loading ? (
        <ProductCardSkeleton count={perpage} />
      ) : (
        <ProductList loading={loading} products={_DATA.currentData()} />
      )}

      <div className="flex mt-10 justify-between">
        <Pagination
          count={count}
          page={page}
          color="primary"
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
        />

        {/* <div className="flex ms-auto">
          Showing {_DATA.maxPage === page ? products.length : perpage * page} of{" "}
          {products.length} results
        </div> */}
      </div>
    </div>
  );
}
