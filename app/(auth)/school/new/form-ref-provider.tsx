'use client'

import { MutableRefObject, createContext, useRef } from "react"

export const FormContext = createContext<MutableRefObject<HTMLFormElement>>(undefined);

export default function FormRefProvider({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLFormElement>();

    return (
        <FormContext.Provider value={ref}>
            {children}
        </FormContext.Provider>
    );
}