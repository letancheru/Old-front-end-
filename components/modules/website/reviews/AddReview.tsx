import React, { useState } from "react";
import Container from "../../custom/Container";
import { Rating } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import { Product, Review, User } from "@/types";
import { cn, getRating } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Toast from "../../custom/Toast";
import toast from "react-hot-toast";
import { useUser } from "@/contexts/UserContext";
import Cookies from "js-cookie";

export default function AddReview({
  product,
  setReviews,
  reviews,
}: {
  product: Product;
  reviews: Review[];
  setReviews: (value: Review[]) => void;
}) {
  const { data: session } = useSession();
  const { user } = useUser() as { user: User | null };
  const token = localStorage?.getItem("token");
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const initialValues = {
    review: "",
    rating: "",
  };

  const handleSave = async (values: { review: string }) => {
    setLoading(true);

    if (!rating || rating === 0) {
      toast.custom(<Toast message="choose a rating 😠" status="error" />);
      setLoading(false);
      return;
    }

    const data = {
      product_id: product.id,
      user_id: user?.id,
      comment: values.review,
      rating: rating,
    };

    // @ts-expect-error: can not process type for children
    setReviews([...reviews, data]);

    //api
    await axios
      .post(process.env.NEXT_PUBLIC_API_URL + "/api/reviews", data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // If authentication is needed
        },
      })
      .then((response) => {
        const data = response.data;
        toast.custom(<Toast message={data.message} status="success" />);
      })
      .catch((error) => {
        toast.custom(<Toast message={error.message} status="error" />);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const validate = Yup.object({
    review: Yup.string().required().min(2).max(255),
    rating: Yup.mixed(),
  });

  return (
    <section>
      <Container>
        <div className="flex flex-col w-full gap-10">
          <div className="flex w-full font-bold text-2xl">Add review</div>
          <div className="flex">
            <div className="flex flex-wrap justify-between">
              <h1>Average:</h1>
              <div className="flex">
                <Rating readOnly value={getRating(product)} precision={0.5} />
                <span className="text-xl font-bold text-yellow-800">
                  (
                  {Number(
                    product?.average_rating ? product?.average_rating : 0
                  )?.toFixed(2)}
                  )
                </span>
              </div>
            </div>
          </div>

          {/* Forms     */}
          <div
            className="
                flex flex-col w-full"
          >
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validate}
              onSubmit={async (values) => {
                handleSave(values);
              }}
            >
              {({
                errors,
                /* and other goodies */
              }) => (
                <Form>
                  <div className="flex flex-col gap-4">
                    <Field
                      components="textarea"
                      name="review"
                      className={cn(
                        "w-full border border-black px-4 h-40 text-black ",
                        errors && "border border-red-300"
                      )}
                    />
                    <ErrorMessage
                      name="review"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>

                  <div className="flex mt-10">
                    <Rating
                      onChange={(event) => {
                        const target = event.target as HTMLInputElement;
                        setRating(parseInt(target.value));
                      }}
                      name="rating"
                      precision={0.5}
                      className="text-2xl"
                      style={{
                        fontSize: "32px",
                      }}
                    />
                  </div>

                  <div className="flex sm:w-full mt-10">
                    {user ? (
                      <Button
                        disabled={loading}
                        type="submit"
                        variant="primary"
                        className="w-auto px-4 py-3 inline-flex gap-4 items-center"
                        size="xl"
                      >
                        <Send />
                        <span className="text-xl">POST YOUR REVIEW</span>
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        className="w-auto px-4 py-3 inline-flex gap-4 items-center"
                        size="sm"
                        asChild
                      >
                        <Link href="/signin">
                          <Send /> Post your review
                        </Link>
                      </Button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Container>
    </section>
  );
}
