import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import { Category, SubCategory } from "@/types/index";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesAccordion({
  className,
  categories,
  loading,
}: {
  className?: string;
  categories?: Category[];
  loading?: boolean;
}) {
  return (
    <Accordion
      type="single"
      collapsible
      className={cn("rounded-sm", className)}
    >
      {!loading ? (
        categories &&
        categories
          ?.filter((e) => e?.parent_id === null)
          ?.map((item: Category, idx: number) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger
                className={cn(
                  "capitalize -mt-5",
                  item.children &&
                    item.children.length === 0 &&
                    "[&>svg]:hidden"
                )}
              >
                <Link
                  href={`/categories/${item?.slug}/products`}
                  className="flex gap-2 mt-2 items-center justify-start"
                >
                  <img
                    src={
                      process.env.NEXT_PUBLIC_API_URL +
                      "/storage/" +
                      item?.thumbnail?.file_path
                    }
                    alt=""
                    className="h-4 w-5 rounded-md"
                  />
                  <p>{item.name}</p>
                </Link>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex ml-4 flex-col gap-4">
                  {item?.children?.map((item2: SubCategory, idx2: number) => (
                    <Link
                      href={`/categories/${item2?.slug}/products`}
                      key={idx2}
                      className="min-w-40 flex items-center justify-start gap-2 hover:text-primary-900 capitalize"
                    >
                      <img
                        src={
                          process.env.NEXT_PUBLIC_API_URL +
                          "/storage/" +
                          item2?.thumbnail?.file_path
                        }
                        alt=""
                        className="h-3 w-4 rounded-md"
                      />
                      {item2.name}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))
      ) : (
        <div className="flex flex-col gap-4 py-4">
          {Array.from({ length: 15 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-full" />
          ))}
        </div>
      )}
    </Accordion>
  );
}
