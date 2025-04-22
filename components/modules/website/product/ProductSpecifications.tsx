import React from "react";
import Container from "../../custom/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Detail, Product } from "@/types";
import { Card } from "@/components/ui/card";
import { Weight } from "lucide-react";

export default function ProductSpecifications({
  product,
}: {
  product: Product;
}) {
  return (
    <section className="hidden lg:block my-10">
      <Container>
        <div className="flex flex-col col-span-2">
          <Tabs defaultValue="desc">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="desc">Descriptions</TabsTrigger>
              <TabsTrigger value="spec">Specifications</TabsTrigger>
            </TabsList>
            <TabsContent value="desc">
              <Card className="p-10 tracking-wider txt-sm leading-8 ">
                {product.description}
              </Card>
            </TabsContent>
            <TabsContent value="spec">
              <Card className="p-10 flex flex-col gap-4">
                <div className="grid grid-cols-2">
                  <span className="w-80 font-bold text-xl capitalize">qty</span>
                  <span className="text-base font-light ">
                    {" "}
                    {product.qty_in_stock}
                  </span>
                </div>

                <div className="grid grid-cols-2">
                  <span className="w-80 font-bold text-xl capitalize">
                    weight
                  </span>
                  <span className="text-base font-light ">
                    {" "}
                    {product.weight}
                  </span>
                </div>

                <div className="grid grid-cols-2">
                  <span className="w-80 font-bold text-xl capitalize">
                    Category
                  </span>
                  <span className="text-base font-light ">
                    {" "}
                    {product?.category?.name}
                  </span>
                </div>

                <div className="grid grid-cols-2">
                  <span className="w-80 font-bold text-xl capitalize">SKU</span>
                  <span className="text-base font-light "> {product.SKU}</span>
                </div>

                <div className="grid grid-cols-2">
                  <span className="w-80 font-bold text-xl capitalize">
                    Created At
                  </span>
                  <span className="text-base font-light ">
                    {" "}
                    {product?.created_at?.split("T")[0]}
                  </span>
                </div>

                <div className="grid grid-cols-2">
                  <span className="w-80 font-bold text-xl capitalize">
                    Updated At
                  </span>
                  <span className="text-base font-light ">
                    {" "}
                    {product?.updated_at?.split("T")[0]}
                  </span>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </section>
  );
}
