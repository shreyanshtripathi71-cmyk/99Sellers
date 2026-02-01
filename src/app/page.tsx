import Wrapper from "@/layouts/Wrapper";
import ModernHome from "@/components/home/home-modern"; 
// ^ Ensure this path points to the index.tsx we built in the previous turn

export const metadata = {
  title: "99Sellers | The Off-Market Deal Terminal",
  description: "Find foreclosures, divorce filings, and tax liens before they hit the MLS.",
};

const MainRoot = () => {
  return (
    <Wrapper>
      <ModernHome />
    </Wrapper>
  );
};

export default MainRoot;