import { cn } from "@/lib/utils";
import { Batch, Product, SubProduct, Variation } from "@/types";
import React, { useState } from "react";
import Container from "../../custom/Container";
import ProductInfo from "./ProductInfo";
import ProductPrice from "./ProductPrice";
import ProductStyleOptions from "./ProductStyleOptions";
import ProductQty from "./ProductQty";
import AdditionnalDescription from "./AdditionnalDescription";
import Loading from "../../custom/Loading";
import CurrencyFormat from "../../custom/CurrencyFormat";

export default function ProductContent({
  className,
  product,
  setImages,
  setActive,
  active,
}: {
  className: string;
  product: Product;
  active: number;
  setImages: (value: string[]) => void;
  setActive: (value: number) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  // const options = product.subProducts[active].options;
  // const [style, setStyle] = useState(product.subProducts[active].style);

  // const styles = product.subProducts.map((item: SubProduct) => {
  //   return item.style;
  // });

  // const [option, setOption] = useState(
  //   product.subProducts[active].options[active]
  // );

  const [optionActive, setOptionActive] = useState(0);
  console.log(product, "product detail");

  // const getStock = () => {
  //   return option.qty - option.sold;
  // };
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null);
  return (
    <section>
      {loading && <Loading isLoading={loading} />}
      <Container>
        <div className={cn("flex gap-8 flex-wrap justify-between", className)}>
          <div className="flex flex-col flex-1 gap-4 items-start">
            {/* product info  */}
            <ProductInfo product={product} />

            <div className="flex flex-col gap-4 items-start min-w-full">
              {/* <ProductPrice product={product} /> */}
              <div className="flex w-full gap-4">
                <CurrencyFormat
                  value={product?.base_selling_price}
                  className="font-bold text-primary-900"
                />

                <CurrencyFormat
                  value={product?.base_buying_price}
                  className="line-through w-16 test-sm hidden lg:flex"
                />
              </div>
              {/* variation list */}
              {product?.variations?.length > 0 && (
                <div className="flex items-center space-x-4 p-4 ">
                  {product?.variations.map((variation: Variation) => (
                    <div
                      key={variation.id}
                      onClick={() => setSelectedId(variation.id)}
                      className={`flex items-center space-x-3 border px-4 py-3 rounded-md cursor-pointer transition-all 
                      ${
                        selectedId === variation.id
                          ? "border-green-500 bg-green-100 shadow-md"
                          : "border-gray-300 bg-white hover:bg-gray-100"
                      }`}
                    >
                      {/* Color Indicator */}
                      <div
                        className="w-8 h-8 rounded border"
                        style={{ backgroundColor: variation.color }}
                      ></div>

                      {/* Variation Details */}
                      <div className="text-sm">
                        <p className="font-medium">
                          {variation.color.charAt(0).toUpperCase() +
                            variation.color.slice(1)}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {variation.size} - ${variation.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* batch list */}
              {product?.batches?.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {product?.batches.map((batch: Batch) => (
                    <div
                      key={batch.id}
                      onClick={() => setSelectedBatch(batch.id)}
                      className={`flex flex-col border px-4 py-3 rounded-lg shadow-sm w-64 cursor-pointer transition-all
              ${
                selectedBatch === batch.id
                  ? "border-green-500 bg-green-100 shadow-md"
                  : "border-gray-300 bg-white hover:bg-gray-100"
              }`}
                    >
                      <p className="text-xs font-medium text-gray-700">
                        Batch #{batch.batch_number}
                      </p>
                      <p className="text-xs text-gray-500">
                        MFG: {batch.manufacturing_date}
                      </p>
                      <p className="text-xs text-gray-500">
                        EXP: {batch.expiration_date}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {batch.quantity_in_batch}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {/* <ProductStyleOptions
                style={style}
                styles={styles}
                setStyle={setStyle}
                setActive={setActive}
                setOption={setOption}
                setOptionActive={setOptionActive}
                setImages={setImages}
                getStock={getStock}
                option={option}
                options={options}
              /> */}

              <ProductQty
                setLoading={setLoading}
                active={active}
                optionActive={optionActive}
                product={product}
              />
            </div>

            <AdditionnalDescription product={product} active={active} />
          </div>
        </div>
      </Container>
    </section>
  );
}
