"use client";

import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { animationCreate } from "@/utils/utils";
import ScrollToTop from "@/components/common/ScrollToTop";
import { AuthProvider } from "@/context/AuthContext";
import MarketingPopup from "@/components/ui/MarketingPopup";

if (typeof window !== "undefined") {
    require("bootstrap/dist/js/bootstrap");
}

const Wrapper = ({ children }: any) => {
    useEffect(() => {
        // animation
        const timer = setTimeout(() => {
            animationCreate();
        }, 100);

        return () => clearTimeout(timer);
    }, []);


    return (
        <AuthProvider>
            {children}
            <ScrollToTop />
            <ToastContainer position="top-center" />
            <MarketingPopup />
        </AuthProvider>
    );
}

export default Wrapper
