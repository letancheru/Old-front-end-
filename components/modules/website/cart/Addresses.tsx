"use client";

import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Address, Cart, Delivery, Payment, User } from "@/types";
import { deliveries, payments } from "@/constants/index";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ClipLoader } from "react-spinners";
import Toast from "../../custom/Toast";
import Checkout from "./Checkout";
import { CartList } from "./CartList";
import { useUser } from "@/contexts/UserContext";
import { useCart } from "@/contexts/CartContext";

export default function Adresses() {
  const { user } = useUser() as { user: User | {} };
  const { cart, setCart } = useCart() as {
    cart: Cart;
    setCart: any;
  };

  const token = localStorage.getItem("token");
  const router = useRouter();

  const [preview, setPreview] = useState<any>(null);

  const initialCoupon = {
    coupon: "",
  };

  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discount, setDiscount] = useState();
  const [selectedPayment, setSelectedPayments] = useState<Payment>();
  const [coupon, setCoupon] = useState("");
  const [loading, setLoading] = useState(false);

  const validateCoupon = yup.object().shape({
    coupon: yup
      .string()
      .min(3, "must have at least 3 characters")
      .max(20, "Maximum 20 characters")
      .required("Coupon name is required"),
  });

  const placeOrderHandler = () => {
    try {
      if (!cart || !user || !preview || !selectedPayment) {
        toast.error(
          "You checkout is not completed. Add items to your cart and try again"
        );
        return;
      }

      // if (coupon) {
      const data = {
        payment_method_id: selectedPayment?.id,
        checkout_token: preview?.checkout_token,
        notes: "pay now",
        ...(coupon && { coupon_code: coupon }),
        // user: user?.id,
        // totalBeforeDiscount: cart?.cartTotal,
        // couponApplied: coupon,
      };
      // } else {
      //   data = {
      //     products: cart?.products,
      //     paymentMethod: selectedPayment.slug,
      //     total: totalAfterDiscount,
      //     user: user?.id,
      //     totalBeforeDiscount: cart?.cartTotal,
      //   };
      // }

      setLoading(true);
      axios
        .post(process.env.NEXT_PUBLIC_API_URL + "/api/checkout/process", data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const data = response.data;
          router.push(`/order/${data?.order?.id}`);
          toast.custom(<Toast message={data.message} status="success" />);
        })
        .catch((err) => {
          toast.custom(<Toast message={err.message} status="error" />);
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchCartPreview = async () => {
      // let couponCode=coupon?`?coupon_code=${coupon}`:''
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/checkout/preview`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const value = await data.json();

      setPreview(value);
      console.log(value, "cart review from address");
      // toast.custom(
      //   <Toast message={"Item removed from cart."} status="success" />
      // );
    };

    fetchCartPreview();
  }, [coupon]);

  return (
    <>
      <div className="">
        {loading ? (
          <ClipLoader className="absolute inset-0 m-auto text-primary-900" />
        ) : (
          ""
        )}

        <div className="mt-6 sm:mt-8 lg:flex lg:items-start lg:gap-7 xl:gap-10">
          <div className="flex-1 gap-y-8">
            {/* Adresses form  */}
            {/* Addresse payment  */}
            <div className="space-y-4 my-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payment
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {preview?.payment_methods &&
                  preview?.payment_methods?.map(
                    (item: Payment, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedPayments(item)}
                        className={cn(
                          "rounded-lg border border-gray-200 bg-gray-50 p-4 ps-4 dark:border-gray-700 dark:bg-gray-800  cursor-pointer",
                          item.id == selectedPayment?.id && "border-primary-700"
                        )}
                      >
                        <div className="flex items-start">
                          <div className="text-sm">
                            <label
                              htmlFor="credit-card"
                              className="font-medium leading-none text-gray-900 dark:text-white capitalize"
                            >
                              {" "}
                              {item?.name} ({item?.status})
                            </label>
                            <p
                              id="credit-card-text"
                              className="mt-1 text-xs font-normal text-gray-500 dark:text-gray-400"
                            >
                              {item?.provider} {item?.type}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <Image
                            src={
                              process.env.NEXT_PUBLIC_API_URL +
                              "/storage/" +
                              item?.logo?.file_path
                            }
                            alt=""
                            width={50}
                            height={50}
                          />
                        </div>
                      </div>
                    )
                  )}
              </div>
            </div>

            {/* Address method delivery*/}
          </div>

          {/* Summary */}
          <div className="w-full space-y-11 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Summary Details
            </h2>

            {/* Address reduction  */}
            <Formik
              enableReinitialize
              initialValues={initialCoupon}
              validationSchema={validateCoupon}
              onSubmit={async (values) => {
                setCoupon(values?.coupon);
                if (loading) {
                  return;
                }

                setLoading(true);
                const data = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/checkout/preview?coupon_code=${values?.coupon}`,
                  {
                    method: "GET",
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  }
                );
                if (!data?.ok) {
                  const data = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/checkout/preview`,
                    {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                      },
                    }
                  );
                  const value = await data.json();

                  setPreview(value);
                  setLoading(false);
                  toast.custom(
                    <Toast message={"Invalid Coupon"} status="error" />
                  );
                }
                const value = await data.json();

                setPreview(value);
                if (value) setLoading(false);
                //   axios
                //     .post(process.env.NEXT_PUBLIC_API_URL + `/api/preview?coupon_code=${values?.coupon}`,)
                //     .then((response) => {
                //       const data = response.data;

                //       if (data.data === null) {
                //         toast.custom(
                //           <Toast message={data.message} status="error" />
                //         );
                //         return;
                //       }
                //       setTotalAfterDiscount(data.totalAfterDiscount);
                //       setCoupon(data.coupon);
                //       setDiscount(data.discount);
                // toast.custom(
                //   <Toast message={data.message} status="success" />
                // );
                //     })
                //     .catch((err) => {
                //       console.log(err);
                //     })
                //     .finally(() => {
                //       setLoading(false);
                //     });
              }}
            >
              {({ errors, touched, handleSubmit }) => (
                <Form>
                  <div className="flex  max-w-md items-center gap-4">
                    <Field
                      name="coupon"
                      id="coupon"
                      className={cn(
                        "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500",
                        errors?.coupon &&
                          touched?.coupon &&
                          "border border-red-900"
                      )}
                      placeholder="Enter a coupon code"
                    />

                    <button
                      disabled={loading}
                      onClick={() => handleSubmit()}
                      type="button"
                      className="flex items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    >
                      Apply
                    </button>
                  </div>
                  <ErrorMessage
                    name="coupon"
                    component="div"
                    className="py-2 font-bold text-red-900"
                  />
                </Form>
              )}
            </Formik>

            {/* <CartList showCart={false} /> */}

            <Checkout
              totalDiscount={preview?.totals?.total_discount}
              couponDiscount={preview?.totals?.coupon_discount}
              productDiscount={preview?.cart?.product_discounts}
              showbutton={false}
              subtotal={preview?.totals?.subtotal}
              tax={preview?.totals?.total_tax}
              total={preview?.totals?.total}
              proceedCheckout={() => {}}
              itemsCount={preview?.totals?.items_count}
              loading={loading}
            />

            <div className="">
              <button
                disabled={loading}
                onClick={() => placeOrderHandler()}
                type="submit"
                className="flex w-full items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
