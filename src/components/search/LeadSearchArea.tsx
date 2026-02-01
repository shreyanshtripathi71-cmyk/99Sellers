"use client"
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchLeads } from "@/redux/features/leadSlice";
import LeadTable from "./LeadTable";
import LeadDetailsModal from "../../modals/LeadDetailsModal";

const LeadSearchArea = () => {
   const dispatch = useDispatch<any>();

   // Load initial data
   useEffect(() => {
      dispatch(fetchLeads());
   }, [dispatch]);

   return (
      <div className="listing-details-one theme-details-one bg-light pt-100 pb-100 lg-pt-80 lg-pb-80 position-relative">
         
         {/* 1. The Modal Component (Hidden by default, controlled by Redux) */}
         <LeadDetailsModal />

         <div className="container">
            <div className="row">
               
               {/* Left Sidebar: Filters */}
               <div className="col-lg-3">
                  <div className="sidebar-container border bg-white p-4 rounded-3 mb-40 shadow-sm">
                     <h5 className="mb-4 border-bottom pb-2">Filter Leads</h5>
                     
                     <div className="mb-4">
                        <label className="form-label fw-500">State</label>
                        <select className="form-select">
                           <option>Texas</option>
                           <option>California</option>
                           <option>Florida</option>
                           <option>New York</option>
                        </select>
                     </div>

                     <div className="mb-4">
                        <label className="form-label fw-500">Lead Type</label>
                        <div className="form-check mb-2">
                           <input className="form-check-input" type="checkbox" id="type1" defaultChecked />
                           <label className="form-check-label" htmlFor="type1">Foreclosure</label>
                        </div>
                        <div className="form-check mb-2">
                           <input className="form-check-input" type="checkbox" id="type2" />
                           <label className="form-check-label" htmlFor="type2">Tax Default</label>
                        </div>
                        <div className="form-check mb-2">
                           <input className="form-check-input" type="checkbox" id="type3" />
                           <label className="form-check-label" htmlFor="type3">Divorce</label>
                        </div>
                     </div>

                     <div className="mb-4">
                        <label className="form-label fw-500">Min. Equity</label>
                        <select className="form-select">
                           <option>$50,000+</option>
                           <option>$100,000+</option>
                           <option>$200,000+</option>
                        </select>
                     </div>

                     <button className="btn-five w-100 text-uppercase rounded-2">Apply Filters</button>
                  </div>
               </div>

               {/* Right Side: The Data Table */}
               <div className="col-lg-9">
                  <LeadTable />
               </div>

            </div>
         </div>
      </div>
   );
};

export default LeadSearchArea;