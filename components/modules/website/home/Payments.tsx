"use client";
import React from "react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { cn } from "@/lib/utils";
import "./style.css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import Container from "../../custom/Container";
import {
  Headset,
  CreditCard,
  LockKeyhole,
  Truck,
  Calendar,
} from "lucide-react";

export default function Payments() {
  return (
    <section className="mt-10 rounded-sm">
      <Container>
        <div className={cn(" flex items-center justify-between w-full")}>
          <div className="relative border w-full rounded-sm rounded-r-none border-r-0 py-2">
            <div className="flex items-center justify-center gap-6">
              <Headset className="h-8 w-8 text-primary-900" />
              <div className="flex flex-col justify-start">
                <h1 className="uppercase text-start text-[12px] font-bold">
                  24/7 Service
                </h1>
                <h2 className="font-normal text-sm">Support every time</h2>
              </div>
            </div>
          </div>
          <div className="relative border w-full rounded-sm rounded-r-none rounded-l-none border-r-0 py-2">
            <div className="flex items-center justify-center gap-6">
              <CreditCard className="h-8 w-8 text-primary-900" />
              <div className="flex flex-col">
                <h1 className="uppercase text-start text-[12px] font-bold">
                  accept payment
                </h1>
                <h2 className="font-normal text-sm">visa, paypal, master</h2>
              </div>
            </div>
          </div>
          <div className="relative border w-full rounded-sm rounded-r-none rounded-l-none border-r-0 py-2">
            <div className="flex items-center justify-center gap-6">
              <LockKeyhole className="h-8 w-8 text-primary-900" />
              <div className="flex flex-col">
                <h1 className="uppercase text-start text-[12px] font-bold">
                  secured payment
                </h1>
                <h2 className="font-normal text-sm">100% secured</h2>
              </div>
            </div>
          </div>
          <div className="relative border w-full rounded-sm rounded-r-none rounded-l-none border-r-0 py-2">
            <div className="flex items-center justify-center gap-6">
              <Truck className="h-8 w-8 text-primary-900" />
              <div className="flex flex-col">
                <h1 className="uppercase text-start text-[12px] font-bold">
                  Multiple Branch
                </h1>
                <h2 className="font-normal text-sm">over 30 branch</h2>
              </div>
            </div>
          </div>
          <div className="relative border w-full rounded-sm py-2">
            <div className="flex items-center justify-center gap-6">
              <Calendar className="h-8 w-8 text-primary-900" />
              <div className="flex flex-col">
                <h1 className="uppercase text-start text-[12px] font-bold">
                  30 days return
                </h1>
                <h2 className="font-normal text-sm">30 days guarentee</h2>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
