'use client'
import React, { useEffect, useState } from "react";
import Container from "../../custom/Container";
import Logo from "../../custom/Logo";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaPinterestP } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { SettingAPi, CompanySetting } from "@/components/service/SettingService";

export default function Footer() {
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

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <Container>
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-gray-400 mb-4">
              {companyInfo?.name || "Elelan Ecommerce"} is your premier destination for high-quality products manufactured locally. 
              We offer a seamless shopping experience with exceptional customer service.
            </p>
            <div className="flex space-x-4">
              {companyInfo?.facebook_page && (
                <a href={companyInfo.facebook_page} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <FaFacebookF size={18} />
                </a>
              )}
              {companyInfo?.twitter_page && (
                <a href={companyInfo.twitter_page} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <FaTwitter size={18} />
                </a>
              )}
              {companyInfo?.instagram_page && (
                <a href={companyInfo.instagram_page} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram size={18} />
                </a>
              )}
              {companyInfo?.linkedin_page && (
                <a href={companyInfo.linkedin_page} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <FaLinkedinIn size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-lg mb-4">Quick Links</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/shops" className="hover:text-white transition-colors">
                  Shops
                </Link>
              </li>
              <li>
                <Link href="/popular-products" className="hover:text-white transition-colors">
                  Popular Products
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  Blog & News
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="font-bold text-lg mb-4">Customer Service</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/hotline" className="hover:text-white transition-colors">
                 Hotline
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="font-bold text-lg mb-4">Contact Us</h5>
            <ul className="space-y-3 text-gray-400">
              {(companyInfo?.address || companyInfo?.city || companyInfo?.state || companyInfo?.zip || companyInfo?.country) && (
                <li className="flex items-start">
                  <MdLocationOn className="mt-1 mr-2 text-white" size={18} />
                  <span>
                    {companyInfo?.address && `${companyInfo.address}, `}
                    {companyInfo?.city && `${companyInfo.city}, `}
                    {companyInfo?.state && `${companyInfo.state} `}
                    {companyInfo?.zip && `${companyInfo.zip}, `}
                    {companyInfo?.country}
                  </span>
                </li>
              )}
             
              {companyInfo?.sales_phone && (
                <li className="flex items-center">
                  <MdPhone className="mr-2 text-white" size={18} />
                  <span>Sales: {companyInfo.sales_phone}</span>
                </li>
              )}
              {companyInfo?.support_phone && (
                <li className="flex items-center">
                  <MdPhone className="mr-2 text-white" size={18} />
                  <span>Support: {companyInfo.support_phone}</span>
                </li>
              )}
              
              {companyInfo?.sales_email && (
                <li className="flex items-center">
                  <MdEmail className="mr-2 text-white" size={18} />
                  <span>Sales: {companyInfo.sales_email}</span>
                </li>
              )}
              {companyInfo?.support_email && (
                <li className="flex items-center">
                  <MdEmail className="mr-2 text-white" size={18} />
                  <span>Support: {companyInfo.support_email}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
      

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} {companyInfo?.name || "Elelan Ecommerce"}. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms And Conditions
              </Link>
              <Link href="/return_policy" className="text-gray-400 hover:text-white transition-colors">
                Return And Cancilation Policy
              </Link>
            </div>
          </div>
          <div className="text-center mt-4 text-gray-500 text-xs">
            <span>Developed by </span>
            <a
              href="https://keradiondesignes.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Keradion Technologies
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
