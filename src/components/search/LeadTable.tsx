"use client"
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ReactPaginate from "react-paginate"; 

import { Lead, openLeadModal } from "@/redux/features/leadSlice";
import useLeads from "@/hooks/useLeads";
import useLeadPagination from "@/hooks/useLeadPagination";

const LeadTable = () => {
   const dispatch = useDispatch();
   const { leads, loading } = useLeads();
   const itemsPerPage = 10;
   const { currentItems, pageCount, handlePageClick } = useLeadPagination(leads, itemsPerPage);
   const [userTier, setUserTier] = useState<"free" | "paid">("free");

   if (loading) {
      return (
         <div className="d-flex justify-content-center align-items-center p-5 bg-white rounded">
            <div className="spinner-border text-primary me-3" role="status"></div>
            <span>Loading Leads...</span>
         </div>
      );
   }

   return (
      // FIX: Added inline style to force REMOVE ALL BORDERS AND SHADOWS
      <div className="bg-white rounded-3 p-4" style={{ border: "none", boxShadow: "none" }}>
         
         {/* --- Header Toolbar --- */}
         <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
            <h4 className="m-0 fw-bold text-dark" style={{ fontSize: '28px' }}>
               Search Results 
               <span className="badge bg-dark ms-3 fs-6 align-middle rounded-pill px-3">{leads.length} Found</span>
            </h4>
            
            <div className="d-flex align-items-center bg-light p-2 rounded" style={{ border: "none" }}>
               <span className="me-2 text-muted small fw-600">VIEW AS:</span>
               <div className="form-check form-switch m-0">
                  <input 
                     className="form-check-input" 
                     type="checkbox" 
                     id="tierSwitch" 
                     checked={userTier === "paid"}
                     onChange={() => setUserTier(userTier === "free" ? "paid" : "free")}
                     style={{ cursor: "pointer" }}
                  />
                  <label className="form-check-label fw-bold text-dark" htmlFor="tierSwitch" style={{ cursor: "pointer" }}>
                     {userTier === "free" ? "FREE USER" : "PRO INVESTOR"}
                  </label>
               </div>
            </div>
         </div>

         {/* --- The Data Table --- */}
         <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ border: "none" }}>
               <thead className="bg-light" style={{ border: "none" }}>
                  <tr style={{ border: "none" }}>
                     <th scope="col" className="py-3 ps-3 rounded-start text-muted fw-bold text-uppercase fs-12" style={{ border: "none" }}>Status</th>
                     <th scope="col" className="py-3 text-muted fw-bold text-uppercase fs-12" style={{ border: "none" }}>Address</th>
                     <th scope="col" className="py-3 text-muted fw-bold text-uppercase fs-12" style={{ border: "none" }}>Location</th>
                     <th scope="col" className="py-3 text-muted fw-bold text-uppercase fs-12" style={{ border: "none" }}>Equity</th>
                     <th scope="col" className="py-3 text-muted fw-bold text-uppercase fs-12" style={{ border: "none" }}>Auction Date</th>
                     <th scope="col" className="py-3 text-end pe-3 rounded-end text-muted fw-bold text-uppercase fs-12" style={{ border: "none" }}>Action</th>
                  </tr>
               </thead>
               <tbody style={{ border: "none" }}>
                  {currentItems.length > 0 ? (
                     currentItems.map((lead: Lead) => (
                        <tr key={lead.id} className="align-middle" style={{ border: "none" }}>
                           
                           <td className="ps-3" style={{ borderBottom: "1px solid #f8f9fa" }}>
                              <span className={`badge rounded-pill px-3 py-2 fw-bold ${
                                 lead.status === 'Foreclosure' ? 'bg-danger-subtle text-danger' : 
                                 lead.status === 'Tax Default' ? 'bg-warning-subtle text-dark' : 'bg-info-subtle text-primary'
                              }`}>
                                 {lead.status}
                              </span>
                           </td>

                           <td style={{ borderBottom: "1px solid #f8f9fa" }}>
                              {userTier === "paid" ? (
                                 <span className="fw-bold text-dark">{lead.address}</span>
                              ) : (
                                 <div className="d-flex flex-column">
                                    <span className="text-muted" style={{ filter: "blur(5px)", userSelect: "none" }}>
                                       {lead.address.substring(0, 12)}...
                                    </span>
                                    <small className="text-danger fw-bold mt-1" style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}>
                                       <i className="fa-solid fa-lock me-1"></i> UPGRADE TO VIEW
                                    </small>
                                 </div>
                              )}
                           </td>

                           <td style={{ borderBottom: "1px solid #f8f9fa" }}>
                              <div className="fw-bold text-dark">{lead.city}, {lead.state}</div>
                              <div className="small text-muted">{lead.zip}</div>
                           </td>

                           <td style={{ borderBottom: "1px solid #f8f9fa" }}>
                              <span className="text-success fw-bold fs-5">
                                 ${lead.price.toLocaleString()}
                              </span>
                           </td>

                           <td style={{ borderBottom: "1px solid #f8f9fa" }}>
                              <div className="d-flex align-items-center text-muted fw-500">
                                 <i className="fa-regular fa-calendar me-2 opacity-50"></i>
                                 {lead.auction_date}
                              </div>
                           </td>

                           <td className="text-end pe-3" style={{ borderBottom: "1px solid #f8f9fa" }}>
                              <button 
                                 className="btn btn-outline-dark btn-sm rounded-pill px-3 text-nowrap fw-500"
                                 style={{ minWidth: "110px" }}
                                 onClick={() => dispatch(openLeadModal({ ...lead, masked: userTier === 'free' }))}
                              >
                                 View Details
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={6} className="text-center py-5 text-muted border-0">
                           No leads found matching your criteria.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* --- Pagination Controls --- */}
         {leads.length > itemsPerPage && (
            <div className="mt-4 d-flex justify-content-end">
               <ReactPaginate
                  breakLabel="..."
                  nextLabel={<span aria-hidden="true">&raquo;</span>}
                  previousLabel={<span aria-hidden="true">&laquo;</span>}
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={3}
                  pageCount={pageCount}
                  renderOnZeroPageCount={null}
                  containerClassName="pagination mb-0"
                  pageClassName="page-item"
                  pageLinkClassName="page-link text-dark shadow-none border-0"
                  previousClassName="page-item"
                  previousLinkClassName="page-link text-dark shadow-none border-0"
                  nextClassName="page-item"
                  nextLinkClassName="page-link text-dark shadow-none border-0"
                  breakClassName="page-item"
                  breakLinkClassName="page-link text-dark shadow-none border-0"
                  activeClassName="active"
                  activeLinkClassName="bg-dark border-dark text-white fw-bold"
                  disabledClassName="disabled"
               />
            </div>
         )}
      </div>
   );
};

export default LeadTable;