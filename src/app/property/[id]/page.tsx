import PropertyDetailsPage from "@/components/dashboard/PropertyDetailsPage";

export const metadata = {
  title: "Property Details - 99Sellers",
  description: "View complete property, owner, and distress details",
};

interface PageProps {
  params: { id: string };
}

const Page = ({ params }: PageProps) => {
  return <PropertyDetailsPage propertyId={parseInt(params.id)} />;
};

export default Page;
