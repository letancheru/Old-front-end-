// components/Header.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// TypeScript interface as per PRD
interface HeaderProps {
  cartItemCount: number;
}

const NewHeader = ({ cartItemCount }: HeaderProps) => {
  // State for mobile menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        {/* <Link href="/" className="flex items-center"> */}
        {/* <Image */}
        {/* src="/logo.png" // You'll need to add this image */}
        {/* alt="CoffeeCup Co." */}
        {/* width={150} */}
        {/* height={40} */}
        {/* priority */}
        {/* /> */}
        {/* </Link> */}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="text-brown-800 hover:text-brown-600">
            Home
          </Link>
          <Link href="/shop" className="text-brown-800 hover:text-brown-600">
            Shop
          </Link>
          <Link href="/about" className="text-brown-800 hover:text-brown-600">
            About
          </Link>
          <Link href="/contact" className="text-brown-800 hover:text-brown-600">
            Contact
          </Link>
        </nav>

        {/* Cart and Profile Section */}
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="relative">
            <span className="sr-only">Cart</span>
            {/* Cart Icon */}
            <svg
              className="w-6 h-6 text-brown-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-brown-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link href="/profile" className="text-brown-800 hover:text-brown-600">
            <span className="sr-only">Profile</span>
            {/* Profile Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-brown-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2 space-y-2">
            <Link
              href="/"
              className="block py-2 text-brown-800 hover:text-brown-600"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block py-2 text-brown-800 hover:text-brown-600"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="block py-2 text-brown-800 hover:text-brown-600"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-brown-800 hover:text-brown-600"
            >
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default NewHeader;
