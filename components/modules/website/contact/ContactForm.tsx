"use client";
import React, { useState, useEffect } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Container from "../../custom/Container";
import { sendEmailTypes } from "@/types";
import Toast from "../../custom/Toast";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { MdEmail, MdPhone, MdLocationOn, MdAccessTime } from "react-icons/md";
import { SettingAPi } from "@/components/service/SettingService";
import { CompanySetting } from "@/components/service/SettingService";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanySetting | null>(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const data = await SettingAPi.getCompanySetting();
        setCompanyInfo(data);
      } catch (error) {
        console.error("Error fetching company info:", error);
      }
    };
    fetchCompanyInfo();
  }, []);

  const validate = Yup.object({
    full_name: Yup.string()
      .required("Full name is required")
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be at most 100 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .nullable()
      .matches(/^[0-9\s+-]*$/, "Invalid phone number format"),
    message: Yup.string()
      .required("Message is required")
      .min(3, "Message must be at least 3 characters"),
  });

  const initialValues = {
    full_name: "",
    email: "",
    phone: "",
    message: "",
  };

  const handleSave = async (values: any, { resetForm }: { resetForm: () => void }) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/message`,
        values
      );
      toast.custom(<Toast status="success" message="Message sent successfully!" />);
      resetForm();
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors 
        ? String(Object.values(error.response.data.errors).flat()[0]) 
        : "Failed to send message";
      toast.custom(<Toast status="error" message={errorMessage} />);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative bg-white dark:bg-gray-900 overflow-hidden">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {loading ? (
        <ClipLoader
          className="fixed inset-0 m-auto z-20"
          size={100}
          color="#3c38ca"
        />
      ) : (
        ""
      )}

      <Container>
        {/* Contact Information Section */}
        <div className="relative py-16 text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative">
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-primary-600"></div>
              <h1 className="text-5xl font-bold mb-6 capitalize text-gray-900 dark:text-white">
                Contact Us
              </h1>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-16 text-lg leading-relaxed">
                We're here to help and answer any questions you might have. We look forward to hearing from you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {/* Location Card */}
              <div className="group relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white p-4 rounded-full shadow-lg">
                    <MdLocationOn className="text-2xl" />
                  </div>
                </div>
                <div className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Our Location</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p className="text-center">
                      {companyInfo?.address || "123 Commerce Street"}
                    </p>
                    <p className="text-center">
                      {companyInfo?.city}, {companyInfo?.state} {companyInfo?.zip}
                    </p>
                    <p className="text-center">
                      {companyInfo?.country || "United States"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Phone Card */}
              <div className="group relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white p-4 rounded-full shadow-lg">
                    <MdPhone className="text-2xl" />
                  </div>
                </div>
                <div className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Phone Numbers</h3>
                  <div className="space-y-3 text-gray-600 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Main Office</span>
                      <a href={`tel:${companyInfo?.phone}`} className="text-lg font-medium hover:text-primary-600 transition-colors">
                        {companyInfo?.phone || "+1 (555) 123-4567"}
                      </a>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Support Line</span>
                      <a href={`tel:${companyInfo?.support_phone}`} className="text-lg font-medium hover:text-primary-600 transition-colors">
                        {companyInfo?.support_phone || "+1 (555) 987-6543"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Email Card */}
              <div className="group relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-600 text-white p-4 rounded-full shadow-lg">
                    <MdEmail className="text-2xl" />
                  </div>
                </div>
                <div className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Email Us</h3>
                  <div className="space-y-3 text-gray-600 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">General Inquiries</span>
                      <a href={`mailto:${companyInfo?.email}`} className="text-lg font-medium hover:text-primary-600 transition-colors">
                        {companyInfo?.email || "info@example.com"}
                      </a>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Support Team</span>
                      <a href={`mailto:${companyInfo?.support_email}`} className="text-lg font-medium hover:text-primary-600 transition-colors">
                        {companyInfo?.support_email || "support@example.com"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form and Map Section */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 dark:bg-primary-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

          {/* Contact Form */}
          <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-600"></div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Send us a Message</h2>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validate}
              onSubmit={async (values, actions) => {
                handleSave(values, actions);
              }}
            >
              {({
                errors,
                touched,
              }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="full_name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Full Name
                    </label>
                    <Field
                      data-testid="full_name"
                      name="full_name"
                      type="text"
                      id="full_name"
                      className={cn(
                        "shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light transition-all duration-300",
                        errors?.full_name && touched?.full_name && "border border-red-900"
                      )}
                      placeholder="John Doe"
                    />
                    <ErrorMessage
                      name="full_name"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Your email
                    </label>
                    <Field
                      data-testid="email"
                      data-cy="email"
                      name="email"
                      type="text"
                      id="email"
                      className={cn(
                        "shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light transition-all duration-300",
                        errors?.email && touched?.email && "border border-red-900"
                      )}
                      placeholder="name@gmail.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Phone (optional)
                    </label>
                    <Field
                      data-testid="phone"
                      name="phone"
                      type="tel"
                      id="phone"
                      className={cn(
                        "shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light transition-all duration-300",
                        errors?.phone && touched?.phone && "border border-red-900"
                      )}
                      placeholder="+1 (555) 123-4567"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
                    >
                      Your message
                    </label>
                    <Field
                      data-testid="message"
                      data-cy="message"
                      name="message"
                      component="textarea"
                      id="message"
                      rows={6}
                      className={cn(
                        "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-300",
                        errors?.message && touched?.message && "border border-red-900"
                      )}
                      placeholder="Leave a comment..."
                    />
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="py-2 font-bold text-red-900"
                    />
                  </div>
                  <button
                    id="submitForm"
                    data-testid="submitForm"
                    data-cy="submitForm"
                    disabled={loading}
                    type="submit"
                    className="w-full py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Send message
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          {/* Map Section */}
          <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-600"></div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">Find Us</h2>
            <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95373631531973!3d-37.817327679751734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnviro!5e0!3m2!1sen!2sus!4v1635167261304!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Business Hours</h3>
              <div className="space-y-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="flex justify-between items-center">
                  <span className="font-medium">Monday - Friday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-medium">Saturday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </p>
                <p className="flex justify-between items-center">
                  <span className="font-medium">Sunday:</span>
                  <span className="text-red-500">Closed</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
