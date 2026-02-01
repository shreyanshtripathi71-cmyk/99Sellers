"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardChart from "./DashboardChart";
import RecentActivity from "./RecentActivity"; 
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";

// Mock Data
const dashboard_stats = [
   {
      id: 1,
      icon: "fa-light fa-heart",
      title: "Saved Leads",
      value: "42",
      trend: "+12%", 
      trendUp: true,
      bg: "bg-danger-subtle",
      color: "text-danger"
   },
   {
      id: 2,
      icon: "fa-light fa-sack-dollar",
      title: "Potential Equity",
      value: "$1.2M",
      trend: "+$50k",
      trendUp: true,
      bg: "bg-success-subtle",
      color: "text-success"
   },
   {
      id: 3,
      icon: "fa-light fa-search",
      title: "Searches Run",
      value: "156",
      trend: "-5%",
      trendUp: false,
      bg: "bg-primary-subtle",
      color: "text-primary"
   },
   {
      id: 4,
      icon: "fa-light fa-layer-group",
      title: "Unlock Credits",
      value: "850",
      trend: "Renewed",
      trendUp: true,
      bg: "bg-warning-subtle",
      color: "text-warning"
   },
]

const DashboardBody = () => {
   const [currentDate, setCurrentDate] = useState("");

   useEffect(() => {
      setCurrentDate(new Date().toLocaleDateString());
   }, []);

   return (
      // FIX: MAIN FLEX CONTAINER
      // This holds Sidebar (Left) and Content (Right) side-by-side naturally.
      <div className="d-flex w-100 min-vh-100 bg-light overflow-hidden">
         
         {/* 1. Sidebar Column */}
         <div className="flex-shrink-0">
            <DashboardHeaderTwo title="Investor Dashboard" />
         </div>

         {/* 2. Main Content Column (Takes remaining space) */}
         <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: "hidden" }}>
            
            {/* Scrollable Content Area */}
            <div className="h-100 p-4 p-xl-5 overflow-auto">
               
               {/* Header */}
               <div className="d-sm-flex align-items-center justify-content-between mb-30 lg-mb-30">
                  <div>
                     <h3 className="fw-bold text-dark m0">Overview</h3>
                     <p className="fs-16 text-muted m0">
                        Portfolio performance for <span className="text-dark fw-500">{currentDate}</span>
                     </p>
                  </div>
                  <div className="d-flex align-items-center gap-3 mt-3 mt-sm-0">
                     <Link href="/search" className="btn-five text-uppercase rounded-3 fw-600 fs-14 shadow-sm">
                        <i className="fa-light fa-plus me-2"></i> New Search
                     </Link>
                  </div>
               </div>

               {/* KPI CARDS */}
               <div className="row">
                  {dashboard_stats.map((item) => (
                     <div key={item.id} className="col-xl-3 col-lg-6 col-md-6">
                        <div className="card-box border-20 bg-white p-4 mb-30 shadow-sm d-flex flex-column justify-content-between" 
                             style={{minHeight: '150px'}}>
                           
                           <div className="d-flex justify-content-between align-items-start mb-2">
                              <span className="fs-13 fw-bold text-muted text-uppercase tracking-wide pt-1">{item.title}</span>
                              <div className={`rounded-circle d-flex align-items-center justify-content-center ${item.bg} ${item.color}`} 
                                   style={{width: '45px', height: '45px', fontSize: '20px'}}>
                                 <i className={item.icon}></i>
                              </div>
                           </div>

                           <div className="d-flex align-items-end justify-content-between mt-2">
                              <h2 className="fw-bold text-dark m-0 lh-1" style={{ fontSize: '28px' }}>{item.value}</h2>
                              <span className={`fs-12 fw-600 px-2 py-1 rounded-pill d-flex align-items-center ${item.trendUp ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                 <i className={`fa-solid ${item.trendUp ? 'fa-arrow-up' : 'fa-arrow-down'} me-1`} style={{fontSize: '10px'}}></i>
                                 {item.trend}
                              </span>
                           </div>

                        </div>
                     </div>
                  ))}
               </div>

               {/* Charts & Tables */}
               <div className="row gx-xxl-5 d-flex pt-15 lg-pt-10">
                  <div className="col-xl-8 col-lg-7 d-flex flex-column">
                     <div className="user-activity-chart bg-white border-20 p-4 shadow-sm mb-30">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                           <div>
                              <h5 className="dash-title-two m0">Equity Opportunity</h5>
                           </div>
                           <span className="badge bg-primary-subtle text-primary">This Week</span>
                        </div>
                        <div className="chart-wrapper" style={{height: '300px'}}>
                           <DashboardChart />
                        </div>
                     </div>

                     <div className="bg-white border-20 p-4 shadow-sm h-100">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                           <h5 className="dash-title-two m0">Recent Saved Leads</h5>
                           <Link href="/dashboard/favourites" className="btn-line fw-500 fs-14">View All</Link>
                        </div>
                        <div className="table-responsive">
                           <table className="table table-hover align-middle custom-table-2">
                              <thead>
                                 <tr className="text-uppercase fs-11 text-muted bg-light">
                                    <th className="py-3 ps-3 rounded-start">Property</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Est. Equity</th>
                                    <th className="py-3 text-end pe-3 rounded-end">Action</th>
                                 </tr>
                              </thead>
                              <tbody className="border-top-0">
                                 {[1, 2, 3].map((i) => (
                                    <tr key={i}>
                                       <td className="ps-3">
                                          <div className="d-flex align-items-center">
                                             <div className="icon-box rounded-3 bg-light d-flex align-items-center justify-content-center me-3 text-dark" style={{width: 40, height: 40, fontSize: '18px'}}>
                                                <i className="fa-light fa-house"></i>
                                             </div>
                                             <div>
                                                <h6 className="m-0 fs-14 fw-bold text-dark">1234 Maple Ave</h6>
                                                <span className="text-muted fs-12">Dallas, TX</span>
                                             </div>
                                          </div>
                                       </td>
                                       <td><span className="badge bg-danger-subtle text-danger px-2 py-1 rounded-pill fw-600 border border-danger-subtle fs-12">Foreclosure</span></td>
                                       <td className="fw-bold text-success fs-14">+$150,000</td>
                                       <td className="text-end pe-3">
                                          <Link href="#" className="btn-four rounded-circle p-0 d-inline-flex align-items-center justify-content-center" style={{width: 30, height: 30}}><i className="fa-light fa-arrow-right"></i></Link>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>

                  <div className="col-xl-4 col-lg-5 d-flex">
                     <div className="recent-job-tab bg-white border-20 p-4 w-100 shadow-sm">
                        <h5 className="dash-title-two mb-4">Activity Log</h5>
                        <RecentActivity />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default DashboardBody