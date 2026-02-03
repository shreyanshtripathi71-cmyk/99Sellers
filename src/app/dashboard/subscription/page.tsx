import DashboardHeaderOne from "@/layouts/headers/dashboard/DashboardHeaderOne";
import SubscriptionPage from "@/components/dashboard/SubscriptionPage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export const metadata = {
  title: "Subscription - 99Sellers",
  description: "Choose your subscription plan",
};

const Page = () => {
  return (
    <ProtectedRoute>
      <DashboardHeaderOne />
      <div className="dashboard-body">
        <div className="position-relative">
          <SubscriptionPage />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
