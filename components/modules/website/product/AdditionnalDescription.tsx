import React, { Fragment } from "react";
import { Product, SubCategory } from "@/types";
import Link from "next/link";
import { BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { BsFacebook, BsLinkedin, BsTwitterX, BsWhatsapp } from "react-icons/bs";
import { usePathname } from "next/navigation";

export default function AdditionnalDescription({
  product,
  active,
}: {
  product: Product;
  active: number;
}) {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-4 sm:mt-2 w-full">
      {/* <li className="inline-flex justify-between gap-4">
        <span className="capitalize font-bold text-2xl">sku:</span>
        <span className="">{product?.SKU}</span>
      </li> */}

      <li className="inline-flex justify-between gap-4">
        <span className="capitalize font-bold text-2xl">categories:</span>
        <span className="">
          
              <Fragment>
                <Link
                  className="capitalize"
                  href={`categories/${product?.category?.id}/products`}
                >
                  {product?.category?.name}
                </Link>
                {product?.category && <BreadcrumbSeparator />}
              </Fragment>
            
        </span>
      </li>

      <li className="inline-flex justify-between gap-4">
        <span className="capitalize font-bold text-2xl">share:</span>
        <div className="inline-flex gap-4">
          <span className="">
            <Link
              target="_blank"
              href={`https://x.com/intent/post?url=${process.env.NEXT_PUBLIC_SERVER_URL}${pathname}`}
            >
              <BsTwitterX className="hover:text-primary-500" />
            </Link>
          </span>
          <span className="">
            <Link
              target="_blank"
              href={`https://linkedin.com/shareArticle?url=${process.env.NEXT_PUBLIC_SERVER_URL}${pathname}`}
            >
              <BsLinkedin className="hover:text-primary-500" />
            </Link>
          </span>
          <span className="">
            <Link
              target="_blank"
              href={`https://facebook.com/sharer/sharer.php?url=${process.env.NEXT_PUBLIC_SERVER_URL}${pathname}`}
            >
              <BsFacebook className="hover:text-primary-500" />
            </Link>
          </span>
          <span className="">
            <Link
              target="_blank"
              href={`https://web.whatsapp.com/send?text=${process.env.NEXT_PUBLIC_SERVER_URL}${pathname}`}
            >
              <BsWhatsapp className="hover:text-primary-500" />
            </Link>
          </span>
        </div>
      </li>
    </ul>
  );
}
