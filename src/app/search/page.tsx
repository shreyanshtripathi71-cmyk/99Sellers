import LeadSearchArea from "@/components/search/LeadSearchArea";
import HeaderTwo from "@/layouts/headers/HeaderTwo";
import FooterOne from "@/layouts/footers/FooterOne";

const SearchPage = () => {
   return (
      <>
         <HeaderTwo style_1={false} style_2={false} />
         <LeadSearchArea />
         <FooterOne style={true} />
      </>
   )
}

export default SearchPage;