// winmss-buddy-web/src/context/AppContext.ts

import React, { createContext, useState, useContext } from "react";
import { MatchesResults } from "../../../winmss-buddy-api/src/models/MatchesResults";

interface AppContextProps {
    apiResponse: MatchesResults | null;
    setApiResponse: (data: MatchesResults) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [apiResponse, setApiResponse] = useState<MatchesResults | null>(null);

    return (
        <AppContext.Provider
            value={{
                apiResponse,
                setApiResponse,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextProps => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
