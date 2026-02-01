"use client"
import React, { useState } from "react";
import styles from "./dashboard.module.scss";

interface Props {
   onClose: () => void;
   onSave: (name: string) => void;
   filters: any;
}

const SaveSearchModal = ({ onClose, onSave, filters }: Props) => {
   const [searchName, setSearchName] = useState("");

   return (
      <div className={styles.modal_overlay}>
         <div className={styles.modal_card}>
            <h3>Save Search Criteria</h3>
            <p style={{marginBottom: '20px', fontSize: '14px', color: '#64748B'}}>
               Save these parameters to your dashboard for quick access later.
            </p>
            
            <div className={styles.input_group}>
               <label>Search Name</label>
               <input 
                  type="text" 
                  placeholder="e.g. Austin Fix & Flips" 
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  autoFocus
               />
            </div>

            <div className={styles.modal_actions}>
               <button onClick={onClose} className={styles.btn_details}>Cancel</button>
               {/* Fixed Button Class */}
               <button 
                  onClick={() => onSave(searchName)} 
                  className={styles.btn_primary_small} 
                  disabled={!searchName}
               >
                  Save View
               </button>
            </div>
         </div>
      </div>
   );
};

export default SaveSearchModal;