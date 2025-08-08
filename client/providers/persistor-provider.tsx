"use client";

import { persistor } from "@/store/store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";

function PersistorProvider({ children }: { children: React.ReactNode }) {
    return <PersistGate persistor={persistor}>{children}</PersistGate>
}

export default PersistorProvider;
