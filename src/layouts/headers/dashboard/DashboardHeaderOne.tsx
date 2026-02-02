"use client"
import Image from "next/image"
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from "@/context/AuthContext";

import dashboardLogo from "@/assets/images/logo/logo_01.svg";
import dashboardIconActive_1 from "@/assets/images/dashboard/icon/icon_1_active.svg";
import dashboardIcon_1 from "@/assets/images/dashboard/icon/icon_1.svg";
import dashboardIconActive_2 from "@/assets/images/dashboard/icon/icon_2_active.svg";
import dashboardIcon_2 from "@/assets/images/dashboard/icon/icon_2.svg";
import dashboardIconActive_3 from "@/assets/images/dashboard/icon/icon_3_active.svg";
import dashboardIcon_3 from "@/assets/images/dashboard/icon/icon_3.svg";
import dashboardIconActive_4 from "@/assets/images/dashboard/icon/icon_4_active.svg";
import dashboardIcon_4 from "@/assets/images/dashboard/icon/icon_4.svg";
import dashboardIconActive_5 from "@/assets/images/dashboard/icon/icon_5_active.svg";
import dashboardIcon_5 from "@/assets/images/dashboard/icon/icon_5.svg";
import dashboardIconActive_6 from "@/assets/images/dashboard/icon/icon_6_active.svg";
import dashboardIcon_6 from "@/assets/images/dashboard/icon/icon_6.svg";
import dashboardIconActive_7 from "@/assets/images/dashboard/icon/icon_7_active.svg";
import dashboardIcon_7 from "@/assets/images/dashboard/icon/icon_7.svg";
import dashboardIconActive_8 from "@/assets/images/dashboard/icon/icon_8_active.svg";
import dashboardIcon_8 from "@/assets/images/dashboard/icon/icon_8.svg";
import dashboardIconActive_9 from "@/assets/images/dashboard/icon/icon_9_active.svg";
import dashboardIcon_9 from "@/assets/images/dashboard/icon/icon_9.svg";
import dashboardIconActive_10 from "@/assets/images/dashboard/icon/icon_10_active.svg";
import dashboardIcon_10 from "@/assets/images/dashboard/icon/icon_10.svg";
import dashboardIcon_11 from "@/assets/images/dashboard/icon/icon_41.svg";

const DashboardHeaderOne = ({ isActive, setIsActive }: any) => {
   const pathname = usePathname();
   const router = useRouter();
   const { logout, user, subscription, isTrialActive, getTrialDaysRemaining } = useAuth();

   const handleLogout = () => {
      logout();
      router.push("/");
   };

   return (
      <aside className={`dash-aside-navbar ${isActive ? "show" : ""}`}>
         <div className="position-relative">
            <div className="logo d-md-block d-flex align-items-center justify-content-between plr bottom-line pb-30">
               <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <span style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b' }}>99<span style={{ color: '#2563eb' }}>Sellers</span></span>
               </Link>
               <button onClick={() => setIsActive(false)} className="close-btn d-block d-md-none"><i className="fa-light fa-circle-xmark"></i></button>
            </div>
            <nav className="dasboard-main-nav pt-30 pb-30 bottom-line">
               <ul className="style-none">
                  <li className="plr"><Link href="/search" className={`d-flex w-100 align-items-center ${pathname === '/search' ? 'active' : ''}`}>
                     <Image src={pathname === '/search' ? dashboardIconActive_1 : dashboardIcon_1} alt="" />
                     <span>Dashboard</span>
                  </Link></li>
                  <li className="plr"><Link href="/search" className={`d-flex w-100 align-items-center ${pathname === '/search' ? 'active' : ''}`}>
                     <Image src={pathname === '/search' ? dashboardIconActive_2 : dashboardIcon_2} alt="" />
                     <span>Search Leads</span>
                  </Link></li>
                  <li className="bottom-line pt-30 lg-pt-20 mb-40 lg-mb-30"></li>
                  <li><div className="nav-title">Leads</div></li>
                  <li className="plr"><Link href="/dashboard/favourites" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/favourites' || pathname === '/dashboard/saved-leads' ? 'active' : ''}`}>
                     <Image src={pathname === '/dashboard/favourites' || pathname === '/dashboard/saved-leads' ? dashboardIconActive_8 : dashboardIcon_8} alt="" />
                     <span>Saved Leads</span>
                  </Link></li>
                  <li className="plr"><Link href="/dashboard/saved-search" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/saved-search' || pathname === '/dashboard/saved-searches' ? 'active' : ''}`}>
                     <Image src={pathname === '/dashboard/saved-search' || pathname === '/dashboard/saved-searches' ? dashboardIconActive_9 : dashboardIcon_9} alt="" />
                     <span>Saved Searches</span>
                  </Link></li>
                  <li className="plr"><Link href="/dashboard/analytics" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/analytics' ? 'active' : ''}`}>
                     <Image src={pathname === '/dashboard/analytics' ? dashboardIconActive_10 : dashboardIcon_10} alt="" />
                     <span>Analytics</span>
                  </Link></li>
                  <li className="plr"><Link href="/dashboard/export" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/export' ? 'active' : ''}`}>
                     <Image src={pathname === '/dashboard/export' ? dashboardIconActive_6 : dashboardIcon_6} alt="" />
                     <span>Export Data</span>
                  </Link></li>
                  <li className="bottom-line pt-30 lg-pt-20 mb-40 lg-mb-30"></li>
                  <li><div className="nav-title">Account</div></li>
                  <li className="plr"><Link href="/dashboard/profile" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/profile' ? 'active' : ''}`}>
                     <Image src={pathname === '/dashboard/profile' ? dashboardIconActive_3 : dashboardIcon_3} alt="" />
                     <span>Profile</span>
                  </Link></li>
                  <li className="plr"><Link href="/dashboard/subscription" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/subscription' || pathname === '/dashboard/membership' ? 'active' : ''}`}>
                     <Image src={pathname === '/dashboard/subscription' || pathname === '/dashboard/membership' ? dashboardIconActive_5 : dashboardIcon_5} alt="" />
                     <span>Subscription</span>
                  </Link></li>
                  <li className="plr"><Link href="/dashboard/account-settings" className={`d-flex w-100 align-items-center ${pathname === '/dashboard/account-settings' ? 'active' : ''}`}>
                     <Image src={pathname === '/dashboard/account-settings' ? dashboardIconActive_4 : dashboardIcon_4} alt="" />
                     <span>Settings</span>
                  </Link></li>
               </ul>
            </nav>
            
            {/* Trial/Subscription Status */}
            {isTrialActive() ? (
               <div className="plr pb-35">
                  <div style={{ padding: "16px", background: "rgba(37, 99, 235, 0.1)", borderRadius: "12px", border: "1px solid rgba(37, 99, 235, 0.2)" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <i className="fa-solid fa-clock" style={{ color: "#2563EB" }}></i>
                        <span style={{ fontWeight: 600, fontSize: "14px" }}>Trial Active</span>
                     </div>
                     <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>{getTrialDaysRemaining()} days remaining</p>
                     <Link href="/dashboard/subscription" style={{ display: "block", marginTop: "12px", padding: "8px 16px", background: "#2563EB", color: "white", borderRadius: "8px", textAlign: "center", fontSize: "13px", fontWeight: 500, textDecoration: "none" }}>
                        Upgrade Now
                     </Link>
                  </div>
               </div>
            ) : subscription?.plan === "free" ? (
               <div className="plr pb-35">
                  <div style={{ padding: "16px", background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)", borderRadius: "12px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                        <i className="fa-solid fa-crown" style={{ color: "#F59E0B" }}></i>
                        <span style={{ fontWeight: 600, fontSize: "14px" }}>Free Plan</span>
                     </div>
                     <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Limited access</p>
                     <Link href="/dashboard/subscription" style={{ display: "block", marginTop: "12px", padding: "8px 16px", background: "#F59E0B", color: "white", borderRadius: "8px", textAlign: "center", fontSize: "13px", fontWeight: 500, textDecoration: "none" }}>
                        Start Free Trial
                     </Link>
                  </div>
               </div>
            ) : null}

            <div className="plr">
               <button onClick={handleLogout} className="d-flex w-100 align-items-center logout-btn" style={{ background: "none", border: "none", cursor: "pointer" }}>
                  <div className="icon tran3s d-flex align-items-center justify-content-center rounded-circle"><Image src={dashboardIcon_11} alt="" /></div>
                  <span>Logout</span>
               </button>
            </div>
         </div>
      </aside>
   )
}

export default DashboardHeaderOne;
