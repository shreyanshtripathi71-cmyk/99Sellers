"use client"
import React from "react";
import DashboardHeaderTwo from "@/layouts/headers/dashboard/DashboardHeaderTwo";

const ProfileArea = () => {
   return (
      <div className="d-flex w-100 min-vh-100 bg-light overflow-hidden">
         
         {/* Sidebar Column */}
         <div className="flex-shrink-0">
            <DashboardHeaderTwo />
         </div>

         {/* Main Content Column */}
         <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: "hidden" }}>
            <div className="h-100 p-4 p-xl-5 overflow-auto">
               
               <h3 className="fw-bold text-dark mb-4">Account Settings</h3>

               <div className="bg-white border-20 p-5 shadow-sm" style={{ maxWidth: '800px' }}>
                  <form action="#" onSubmit={(e) => e.preventDefault()}>
                     <div className="row">
                        <div className="col-12 mb-4">
                           <h5 className="fw-bold text-dark mb-3">Personal Information</h5>
                        </div>
                        
                        <div className="col-md-6 mb-3">
                           <label className="form-label fw-500 text-dark">First Name</label>
                           <input type="text" className="form-control bg-light border-0 py-3 px-3" placeholder="John" />
                        </div>
                        
                        <div className="col-md-6 mb-3">
                           <label className="form-label fw-500 text-dark">Last Name</label>
                           <input type="text" className="form-control bg-light border-0 py-3 px-3" placeholder="Doe" />
                        </div>
                        
                        <div className="col-12 mb-4">
                           <label className="form-label fw-500 text-dark">Email Address</label>
                           <input type="email" className="form-control bg-light border-0 py-3 px-3" placeholder="john.doe@example.com" />
                        </div>

                        <div className="col-12 pt-3">
                           <button className="btn-five text-uppercase rounded-3 fw-600">Save Changes</button>
                        </div>
                     </div>
                  </form>
               </div>

            </div>
         </div>
      </div>
   )
}

export default ProfileArea;