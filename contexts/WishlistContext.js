"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/wishlists`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWishlist(response?.data || []);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        // setError("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Empty dependency array means it runs only once when the component mounts

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a UserProvider");
  }
  return context;
};
