/* eslint-disable  no-useless-escape */
"use client";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import Toast from "../../custom/Toast";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import Loading from "../../custom/Loading";
import axios from "axios";

type initialValuesProps = {
  _id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  image: string;
  phone: string;
  date_of_birth: string;
  address_line1: string;
  address_line2: string;
  city: string;
  region: string;
  zone: string;
  woreda: string;
  kebele: string;
  location: string;
  country: string;
};

export default function Profil({ user }: { user: User }) {
  const router = useRouter();
  const initialValues = {
    _id: user.id,
    name: user.name,
    first_name: user?.name?.split(" ")[0],
    last_name: user?.name?.split(" ")[1],
    email: user.email,
    password: user.password,
    confirm_password: user.password,
    image: user.image,
    phone: user.phone,
    date_of_birth: user.date_of_birth,
    address_line1: user.address_line1,
    address_line2: user.address_line2,
    city: user.city,
    region: user.city,
    zone: user.zone,
    woreda: user.woreda,
    kebele: user.kebele,
    location: user.location,
    country: user.country,
  };

  const validate = Yup.object({
    name: Yup.string().required().min(2).max(60),
    email: Yup.string().required().email(),
    password: Yup.string()
      .required("required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirm_password: Yup.string()
      .required("The passwords are not the same")
      .oneOf([Yup.ref("password"), "null"], "Passwords must match"),
  });

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(
    "https://cdn-icons-png.flaticon.com/128/236/236831.png"
  );

  const handleSave = async (values: initialValuesProps) => {
    setLoading(true);
    const data = {
      id: values._id,
      first_name: values.name?.split(" ")[0],
      last_name: values.name?.split(" ")[1],
      email: values.email,
      media: file,
      password: values.password,
      confirm_password: values.confirm_password,
    };

    // try {
    //   const response = await fetch(
    //     process.env.NEXT_PUBLIC_API_URL + "/api/account/profil",
    //     {
    //       method: "PUT",
    //       body: JSON.stringify(data),
    //     }
    //   );

    //   if (!response.ok) {
    //     response.json().then((data) => {
    //       console.log(data);
    //       toast.custom(<Toast message={data.message} status="error" />);
    //       return data;
    //     });
    //   } else {
    //     response.json().then((data) => {
    //       console.log(data);
    //       toast.custom(<Toast message={data.message} status="success" />);
    //       return data;
    //     });
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
    axios
      .put(process.env.NEXT_PUBLIC_API_URL + "/api/auth/user", data)
      .then((response) => {
        const data = response.data;
        toast.custom(<Toast message={data.message} status="success" />);
        router.refresh();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        router.refresh();
      });

    setLoading(false);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;
    setLoading(true);

    if (!files[0]) {
      setLoading(false);
      return;
    }
    const formData = new FormData();
    console.log(files[0]);

    formData.append("file", files[0]);

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SERVER_URL + "/api/cloudinary",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response.ok) {
        response.json().then((data) => {
          console.log(data);
          toast.custom(<Toast message={data.message} status="error" />);
          setLoading(true);
        });
      } else {
        response.json().then((data) => {
          console.log(data);
          setFile(data.imgUrl);
          toast.custom(<Toast message={data.message} status="success" />);
          setLoading(false);
        });
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const imageRef = useRef<HTMLInputElement>(null);

  return (
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
        <Form className="w-full h-[100vh] overflow-y-scroll pb-32">
          {loading && <Loading isLoading={loading} />}
          <input type="hidden" name="_id" value={initialValues._id} />

          <div className="flex w-full gap-4 flex-wrap mb-4 ">
            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="first_name">First Name</label>
              <Field
                type="text"
                name="first_name"
                placeholder="First name"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.first_name && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="first_name"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>

            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="last_name">Last Name</label>
              <Field
                type="text"
                name="last_name"
                placeholder="Last name"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.last_name && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="last_name"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>
          </div>

          <div className="flex w-full gap-4 mt-2 flex-wrap mb-4 ">
            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="phone">Phone</label>
              <Field
                type="text"
                name="phone"
                placeholder="Phone"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.phone && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>

            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="email">Email</label>
              <Field
                type="text"
                name="email"
                placeholder="Email"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors.email && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>
          </div>

          <div className="flex w-full gap-4 mt-2 flex-wrap mb-4 ">
            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="date_of_birth">Date of birth</label>
              <Field
                type="text"
                name="date_of_birth"
                placeholder="Date of birth"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.date_of_birth && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="date_of_birth"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>

            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="address_line1">Address line 1</label>
              <Field
                type="text"
                name="address_line1"
                placeholder="Address line 1"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.address_line1 && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="address_line1"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>
          </div>

          <div className="flex w-full gap-4 mt-2 flex-wrap mb-4 ">
            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="date_of_birth">Address line 2</label>
              <Field
                type="text"
                name="address_line2"
                placeholder="Address line 2"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.address_line2 && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="address_line2"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>

            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="city">City</label>
              <Field
                type="text"
                name="city"
                placeholder="City"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.city && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="city"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>
          </div>

          <div className="flex w-full gap-4 mt-2 flex-wrap mb-4 ">
            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="region">Region</label>
              <Field
                type="text"
                name="region"
                placeholder="Region"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.region && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="region"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>

            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="zone">Zone</label>
              <Field
                type="text"
                name="zone"
                placeholder="Zone"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.zone && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="zone"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>
          </div>

          <div className="flex w-full gap-4 mt-2 flex-wrap mb-4 ">
            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="woreda">Woreda</label>
              <Field
                type="text"
                name="woreda"
                placeholder="Woreda"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.woreda && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="woreda"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>

            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="kebele">Kebele</label>
              <Field
                type="text"
                name="kebele"
                placeholder="Kebele"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.kebele && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="kebele"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>
          </div>

          <div className="flex w-full gap-4 mt-2 flex-wrap mb-4 ">
            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="location">Location</label>
              <Field
                type="text"
                name="location"
                placeholder="Location"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.location && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="location"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>

            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="country">Country</label>
              <Field
                type="text"
                name="country"
                placeholder="Country"
                className={cn(
                  "border  px-4 text-black py-2 rounded",
                  errors?.country && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="country"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>
          </div>

          <div className="flex w-full gap-4 flex-wrap mt-2 mb-4">
            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="password">Password</label>
              <Field
                type="password"
                name="password"
                className={cn(
                  "w-full border px-4 py-2 rounded text-black ",
                  errors.password && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="password"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>

            <div className="flex flex-col gap-4 sm:w-[320px] grow">
              <label htmlFor="password">Confirm Password</label>
              <Field
                type="password"
                name="confirm_password"
                className={cn(
                  "w-full border  px-4 py-2 text-black rounded",
                  errors.password && "border border-red-300"
                )}
              />
              <ErrorMessage
                name="confirm_password"
                component="div"
                className="py-2 font-bold text-red-900"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:w-[320px] grow my-10">
            <label htmlFor="media">Image</label>
            <input
              hidden
              disabled={loading}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleImage(e)
              }
              ref={imageRef}
              type="file"
              name="media"
              accept="image/png, image/jpg"
              className={cn(
                "w-full border  px-4 py-2 rounded-md text-black ",
                errors.image && "border border-red-300"
              )}
            />
            <div
              role="button"
              onClick={() => imageRef?.current?.click()}
              className="cursor-pointer flex flex-wrap item-center justify-center border border-gray-300 p-4"
            >
              {file ? "change the image" : " select an image"}
            </div>
            <ErrorMessage
              name="image"
              component="div"
              className="py-2 font-bold text-red-900"
            />
          </div>

          <div className="flex sm:w-full">
            <Button
              disabled={loading}
              type="submit"
              variant="primary"
              className="w-full inline-flex gap-4 items-center"
              size="lg"
            >
              <Send />
              <span className="text-xl">Update </span>
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
