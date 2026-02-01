// src/app/search/page.tsx
"use client"
import React from "react";
import Wrapper from "@/layouts/Wrapper";
import LeadTerminal from "@/components/search/LeadTerminal"; // We will build this below

const SearchPage = () => {
  return (
    <Wrapper>
       {/* Note: We typically DO NOT use the public header for the app.
         We use a Dashboard Layout. But for now, let's keep it simple.
       */}
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#F8FAFC' }}>
         <LeadTerminal />
      </div>
    </Wrapper>
  );
};

export default SearchPage;