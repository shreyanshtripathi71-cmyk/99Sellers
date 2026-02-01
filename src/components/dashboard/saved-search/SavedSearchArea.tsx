"use client"
import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";

const saved_searches = [
   { id: 1, title: "Dallas Foreclosures > $100k", filters: "City: Dallas, Type: Foreclosure", date: "2 hours ago" },
   { id: 2, title: "Austin Tax Defaults", filters: "City: Austin, Type: Tax Default", date: "1 day ago" },
   { id: 3, title: "Houston Fix & Flips", filters: "City: Houston, Type: Pre-Foreclosure", date: "3 days ago" },
];

const SavedSearchArea = () => {
   const [mounted, setMounted] = useState(false);
   useEffect(() => setMounted(true), []);
   if (!mounted) return null;

   return (
      <div className="d-flex w-100 min-vh-100 bg-light overflow-hidden">
         
         {/* Sidebar */}
         <div className="flex-shrink-0">
            <DashboardHeaderTwo />
         </div>

         {/* Content */}
         <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: "hidden" }}>
            <div className="h-100 p-4 p-xl-5 overflow-auto">
               
               <div className="d-flex align-items-center justify-content-between mb-30 lg-mb-20">
                  <div>
                     <h3 className="fw-bold text-dark m0">Saved Searches</h3>
                     <p className="fs-16 text-muted m0">Quickly rerun your best criteria.</p>
                  </div>
               </div>

               <div className="row">
                  {saved_searches.map((item) => (
                     <div key={item.id} className="col-xl-4 col-md-6">
                        <div className="card-box border-20 bg-white p-4 mb-30 shadow-sm transition-3s hover-shadow-lg">
                           <div className="d-flex justify-content-between align-items-start mb-3">
                              <div className="icon-box rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center" 
                                   style={{width: 45, height: 45, fontSize: '20px'}}>
                                 <i className="fa-light fa-magnifying-glass"></i>
                              </div>
                              <button className="btn-three rounded-circle" style={{width: 35, height: 35, padding: 0}}>
                                 <i className="fa-light fa-trash"></i>
                              </button>
                           </div>
                           <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                           <p className="text-muted fs-14 mb-4">{item.filters}</p>
                           
                           <div className="d-flex align-items-center justify-content-between mt-auto border-top pt-3">
                              <span className="fs-13 text-muted">{item.date}</span>
                              <Link href="/search" className="btn-line fw-600">Run Search</Link>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

            </div>
         </div>
      </div>
   )
}

export default SavedSearchArea;