"use client"
import React from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";

const MembershipArea = () => {
   return (
      <div className="d-flex w-100 min-vh-100 bg-light overflow-hidden">
         
         {/* Sidebar */}
         <div className="flex-shrink-0">
            <DashboardHeaderTwo />
         </div>

         {/* Content */}
         <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: "hidden" }}>
            <div className="h-100 p-4 p-xl-5 overflow-auto">
               
               <h3 className="fw-bold text-dark mb-4">Membership Plan</h3>

               <div className="row">
                  {/* Current Plan */}
                  <div className="col-lg-6 mb-4">
                     <div className="card-box border-20 bg-dark text-white p-5 shadow-lg position-relative overflow-hidden">
                        <div className="position-absolute top-0 end-0 m-4 opacity-25">
                           <i className="fa-light fa-crown" style={{ fontSize: '100px' }}></i>
                        </div>
                        <h5 className="text-white-50 text-uppercase tracking-wide mb-2">Current Plan</h5>
                        <h1 className="fw-bold mb-3 display-4">Pro Investor</h1>
                        <p className="fs-18 opacity-75 mb-4">Unlimited Searches • Daily Alerts • CSV Exports</p>
                        <button className="btn btn-light text-dark fw-bold rounded-pill px-4 py-2">Manage Subscription</button>
                     </div>
                  </div>

                  {/* Payment Method */}
                  <div className="col-lg-6 mb-4">
                     <div className="card-box border-20 bg-white p-5 shadow-sm h-100">
                        <h5 className="fw-bold text-dark mb-4">Payment Method</h5>
                        <div className="d-flex align-items-center border rounded-3 p-3 mb-3">
                           <i className="fa-brands fa-cc-visa fs-1 text-primary me-3"></i>
                           <div>
                              <div className="fw-bold text-dark">Visa ending in 4242</div>
                              <div className="text-muted fs-14">Expires 12/28</div>
                           </div>
                        </div>
                        <button className="btn-line fw-600 text-primary">Update Card</button>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </div>
   )
}

export default MembershipArea;