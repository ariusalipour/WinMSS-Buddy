import React, { createContext, useState, useContext } from "react";
import { ProcessedData, ChampionshipResult } from "../../../winmss-buddy-api/src/models.ts";

interface AppContextProps {
    processedData: ProcessedData | null;
    setProcessedData: (data: ProcessedData) => void;
    championshipResults: ChampionshipResult[] | null;
    setChampionshipResults: (results: ChampionshipResult[]) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
    const [championshipResults, setChampionshipResults] = useState<ChampionshipResult[] | null>(null);

    return (
        <AppContext.Provider
            value={{
        processedData,
            setProcessedData,
            championshipResults,
            setChampionshipResults,
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
