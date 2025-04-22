import { Slide } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeaderImage({ slug }: { slug?: string }) {
  const [slides, setSlides] = useState<any>({});
  const [loading, setLoading] = useState(false);

  // get api
  useEffect(() => {
    const getSlides = async () => {
      setLoading(true);
      await axios
        .get(process.env.NEXT_PUBLIC_API_URL + `/api/categories-slug/${slug}`)
        .then((response) => {
          setSlides(response.data);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getSlides();
  }, []);

  console.log(slides, "header image from categories");
  return (
    <>
      {!loading ? (
        <div>
          <div
            className="flex w-full rounded-lg bg-cover justify-center h-[350px] items-center"
            style={{
              backgroundImage: `url(${
                process.env.NEXT_PUBLIC_API_URL +
                "/storage/" +
                slides?.thumbnail?.file_path
              })`,
              height: "350px",
            }}
          >
            <h1
              className={cn(
                "text-xl lg:text-4xl uppercase text-black backdrop font-extrabold tracking-wider"
              )}
            >
              {slug}
            </h1>
          </div>
        </div>
      ) : (
        <div className="w-full h-[300px] bg-gray-100">
          <Skeleton className="h-[260px] w-full rounded-lg" />
        </div>
      )}
    </>
  );
}
