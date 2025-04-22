import { Button } from "@/components/ui/button";
import { getDate } from "@/lib/utils";
import { Review } from "@/types";
import { Rating } from "@mui/material";
import { ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";

export default function ReviewItem({ item }: { item: Review }) {
  const { data: session } = useSession();

  const loading = false;
  console.log(item, "item review");
  return (
    <article className="p-6 text-base bg-white rounded-lg ">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="inline-flex item-center mr-3 text-sm text-gray-900">
            <Image
              alt="review"
              src={
                item?.user?.image
                  ? item?.user?.image
                  : "https://cdn-icons-png.flaticon.com/128/149/149071.png"
              }
              width="40"
              height="40"
              className="mr-2 w-auto rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-black">
                {item?.user?.name ? item?.user?.name : "unknown"}
              </span>
              <div className="flex"> {getDate(item?.created_at)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p>{item.comment} </p>
        <div className="flex gap-2 items-center justify-start">
          <Rating value={item.rating} precision={0.5} readOnly />{" "}
          <span>{item?.rating}</span>
        </div>
      </div>
    </article>
  );
}
