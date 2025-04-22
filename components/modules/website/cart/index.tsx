"use client";
import { IRootState } from "@/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Container from "../../custom/Container";
// import CartList from "./CartList";
import EmptyCart from "./EmptyCart";
import { useUser } from "@/contexts/UserContext";
import Cookies from "js-cookie";
import { Cart as TCart, User } from "@/types";
import axios from "axios";
import { CartList } from "./CartList";
import { useCart } from "@/contexts/CartContext";
import CartItem from "./CartItem";
import CartHeader from "./CartHeader";
import Checkout from "./Checkout";

export {
  CartList,
  CartItem,
  CartHeader,
  Checkout,
  EmptyCart,
};

export default CartList;
