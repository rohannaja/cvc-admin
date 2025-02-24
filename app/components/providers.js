"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "./query-provider";
import ModalProvider from "./modal-provider";
import { Toaster } from "@/components/ui/toaster"
const Provider = ({ children }) => {
  return (
    <>
            <SessionProvider>
              <QueryProvider>
                <ModalProvider/>
                <Toaster />
                {children}
              </QueryProvider>
            </SessionProvider>
    </>
  );
};

export default Provider;