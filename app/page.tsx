import Banner from "@/components/modules/website/home/Banner";
import BrandList from "@/components/modules/website/home/BrandList";
import FeaturesProducts from "@/components/modules/website/home/FeaturesProducts";
import Newletter from "@/components/modules/website/home/Newletter";
import TopCategories from "@/components/modules/website/home/TopCategories";
import * as React from "react";
import { Metadata } from "next";
import { mergeOpenGraph } from "@/lib/mergeOpenGraph";
import Cta1 from "@/components/modules/website/home/Cta1";
import SpecialOffers from "@/components/modules/website/home/SpecialOffers";
import Partner from "@/components/modules/website/home/Partner";
import MostRatedProducts from "@/components/modules/website/MostRatedProducts";
import PopularProducts from "@/components/modules/website/products/PopularProducts";
import Cta from "@/components/modules/website/home/Cta";
import BestSellersProducts from "@/components/modules/website/home/BestSellersProducts";

export default function Home() {
  return (
    <>
      <Banner />
      <TopCategories />
      <FeaturesProducts />
     
      <Cta />
      <BrandList />
   
      
     
      <MostRatedProducts />
      <BestSellersProducts />
      <Partner />
    </>
  );
}

export const metadata: Metadata = {
  title: "Elelan Ecommerce",
  description: "Elelan Ecommerce",
  icons: {
    icon: "/assets/images/logo.svg",
  },
  openGraph: mergeOpenGraph({
    title: "Home - Elelan Ecommerce",
    url: "/",
  }),
};
