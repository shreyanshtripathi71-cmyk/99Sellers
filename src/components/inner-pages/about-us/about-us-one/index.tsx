import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne"
import BLockFeatureOne from "./BLockFeatureOne"
import Brand from "./Brand"
import FooterFour from "@/layouts/footers/FooterFour"


const AboutUsOne = () => {
   return (
      <>
         <BreadcrumbOne title="About Agency" sub_title="About us" style={false} />
         <BLockFeatureOne />
         <Brand />
         <FooterFour />
      </>
   )
}

export default AboutUsOne
