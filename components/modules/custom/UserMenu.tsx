import React from "react";
import ReactDOM from "react-dom";
import { m } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";

type User = {
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  image: string;
};

export default function UserMenu({ openUserMenu }: { openUserMenu: boolean }) {
  const { user, setUser } = useUser() as {
    user: User | null;
    setUser: (user: User | null) => void;
  };

  if (!openUserMenu) return null;

  const menu = (
    <m.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-[320px] rounded-md bg-white px-4 py-8 fixed shadow-2xl right-0 top-14 flex flex-col justify-center items-center gap-4 z-[99999999]"
    >
      <h4>Welcome to Elelan</h4>

      {user && (
        <div className="flex relative z-[999999] items-center gap-4">
          <Image
            src={
              user?.image
                ? user?.image
                : "https://cdn-icons-png.flaticon.com/128/236/236831.png"
            }
            width="80"
            height="80"
            alt="image profil"
          />

          <div className="flex flex-col justify-center items-center gap-2">
            <span className="font-bold text-primary-800 text-xl capitalize">
              Welcome back
            </span>
            <h4 className="font-bold text-primary-800 capitalize">
              {user?.first_name}
            </h4>

            <Button
              onClick={() => {
                localStorage.removeItem("token");
                setUser(null);
              }}
              variant="outline"
              size="icon"
              className="w-28 flex gap-4 justify-around"
            >
              <LogOut className="" />
              Sign-out
            </Button>
          </div>
        </div>
      )}

      {user && (
        <ul className="flex flex-col gap-4 w-full items-start">
          <li>
            <hr />
          </li>
          <li className="hover:bg-neutral-50 w-full items-center py-2">
            <Link href="/account/dashboard">Dashboard</Link>
          </li>
          <li className="hover:bg-neutral-50 w-full items-center py-2">
            <Link href="/account/profil">Account</Link>
          </li>
          <li className="hover:bg-neutral-50 w-full items-center py-2">
            <Link href="/account/order">My orders</Link>
          </li>
          {/* <li className="hover:bg-neutral-50 w-full items-center py-2">
            <Link href="/account/address">My address</Link>
          </li> */}
        </ul>
      )}
    </m.div>
  );

  return ReactDOM.createPortal(menu, document.body);
}
