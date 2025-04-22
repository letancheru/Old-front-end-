"use client";
import { createContext, useContext, useEffect, useState } from "react";

const BranchContext = createContext(null);

export const BranchProvider = ({ children }) => {
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const branchId = localStorage.getItem("elelan_selected_branch");

    setBranch(branchId || "");

    setLoading(false);
  }, []);

  return (
    <BranchContext.Provider value={{ branch, setBranch, loading }}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useWishlist must be used within a UserProvider");
  }
  return context;
};
