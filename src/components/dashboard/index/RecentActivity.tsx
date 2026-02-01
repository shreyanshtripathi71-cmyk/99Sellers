"use client"
import Link from "next/link";

const RecentActivity = () => {
   const activities = [
      { 
         id: 1, 
         title: "Lead Saved", 
         desc: "You saved 1234 Maple Ave to 'Flip Candidates'.", 
         time: "2 hrs ago", 
         icon: "fa-heart", 
         color: "text-danger", 
         bg: "bg-danger-subtle" 
      },
      { 
         id: 2, 
         title: "New Match Alert", 
         desc: "3 new Tax Defaults found in Travis County.", 
         time: "5 hrs ago", 
         icon: "fa-bell", 
         color: "text-warning", 
         bg: "bg-warning-subtle" 
      },
      { 
         id: 3, 
         title: "CSV Export", 
         desc: "Downloaded 'Dallas_HighEquity.csv' (50 rows).", 
         time: "1 day ago", 
         icon: "fa-file-arrow-down", 
         color: "text-success", 
         bg: "bg-success-subtle" 
      },
      { 
         id: 4, 
         title: "Search Filter Saved", 
         desc: "Saved 'Pre-Foreclosures > $100k Equity'.", 
         time: "2 days ago", 
         icon: "fa-filter", 
         color: "text-primary", 
         bg: "bg-primary-subtle" 
      },
   ];

   return (
      <div className="activity-wrapper position-relative">
         {activities.map((item, index) => (
            <div key={item.id} className="d-flex align-items-start mb-4 position-relative">
               {/* Vertical Line Connector */}
               {index !== activities.length - 1 && (
                  <div className="position-absolute top-0 start-0 h-100 border-start ms-4" 
                       style={{marginTop: '40px', left: '6px', borderColor: '#e5e7eb'}}></div>
               )}
               
               {/* Icon Bubble */}
               <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 me-3 ${item.bg} ${item.color}`} 
                    style={{width: '45px', height: '45px', fontSize: '18px', zIndex: 2}}>
                  <i className={`fa-light ${item.icon}`}></i>
               </div>
               
               {/* Text Content */}
               <div className="pt-1">
                  <div className="d-flex justify-content-between align-items-center w-100">
                     <h6 className="mb-1 fs-15 fw-bold text-dark">{item.title}</h6>
                     <span className="fs-12 text-muted ms-3 text-nowrap">{item.time}</span>
                  </div>
                  <p className="m-0 fs-14 text-muted lh-sm">{item.desc}</p>
               </div>
            </div>
         ))}
         
         <Link href="/dashboard/profile" className="btn-line fw-500 mt-2 d-block text-center">
            View Full History
         </Link>
      </div>
   )
}

export default RecentActivity