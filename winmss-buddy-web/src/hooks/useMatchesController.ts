// src/hooks/useMatchesController.ts
import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { MatchesController } from "../controllers/MatchesController";
import {ApiResponse} from "../models/ApiResponse.ts";

export const useMatchesController = (): MatchesController | null => {
    const { apiResponse } = useAppContext();

    // Only instantiate the controller when processedData is available.
    const controller = useMemo(() => {
        if (!apiResponse) return null;
        return new MatchesController(apiResponse as ApiResponse);
    }, [apiResponse]);

    return controller;
};