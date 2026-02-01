import React from "react";

const LogoStrip = () => {
   return (
      <div className="border-top border-bottom border-white border-opacity-10 bg-black py-4">
         <div className="container">
            <div className="d-flex justify-content-center align-items-center gap-5 flex-wrap opacity-25 grayscale hover-grayscale-0 transition-3s">
               {['RE/MAX', 'Keller Williams', 'Coldwell Banker', 'Exp Realty', 'Century 21'].map((brand, i) => (
                  <h3 key={i} className="m-0 text-white fw-bold fs-3" style={{ fontFamily: 'serif', letterSpacing: '-1px' }}>{brand}</h3>
               ))}
            </div>
         </div>
      </div>
   );
};

export default LogoStrip;