"use client";

import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      try {
        // const token = Cookies.get("auth_token"); // Get token from cookies
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          setUser(null);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Send the token in Authorization header
              "Content-Type": "application/json",
            },
            // credentials: "include", // Ensures cookies (JWT) are sent (if needed)
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile info");

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.log("User not authenticated or error fetching user info");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Empty dependency array means it runs only once when the component mounts

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
