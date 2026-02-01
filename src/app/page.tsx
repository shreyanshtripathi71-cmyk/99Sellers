import React from "react";
import Wrapper from "@/layouts/Wrapper"; // Assuming you have this layout wrapper
import ModernHome from "@/components/home/home-modern"; // Fixed path to 'homes'

export const metadata = {
  title: "99Sellers - The #1 Off-Market Lead Finder",
  description: "Find off-market real estate deals including foreclosure, divorce, and tax liens.",
};

const MainRoot = () => {
  return (
    <Wrapper>
      <ModernHome />
    </Wrapper>
  )
}

export default MainRoot;