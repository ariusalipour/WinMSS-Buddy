// winmss-buddy-web/src/controllers/CompetitorController.ts

import { CompetitorModel } from "../models/CompetitorModel";
import { useAppContext } from "../context/AppContext";

export class CompetitorController {
    /**
     * Fetches and transforms competitor data from the app context.
     * @returns {CompetitorModel[]} Array of mapped competitor data.
     */
    static getCompetitors(): CompetitorModel[] {
        const { processedData } = useAppContext();

        if (!processedData || !Array.isArray(processedData.registrations)) {
            console.error("Processed data is missing or invalid");
            return [];
        }

        const { registrations, competitors, squads } = processedData;

        // Map raw data to CompetitorModel and filter null values
        const competitorsMapped = registrations
            .map((reg) => {
                const competitor = competitors.find((comp) => comp.memberId === reg.memberId);
                const squad = squads.find((sqd) => sqd.squadId === reg.squadId);

                if (competitor) {
                    // Ensure type compatibility with CompetitorModel
                    const mappedCompetitor: CompetitorModel = {
                        key: `${reg.matchId}-${reg.memberId}`, // Unique key
                        firstName: competitor.firstname,
                        lastName: competitor.lastname,
                        division: reg.divisionId,
                        category: reg.categoryId,
                        region: competitor.regionId,
                        class: competitor.classId, // Convert to string
                        squadName: squad?.squadName || "N/A",
                    };

                    return mappedCompetitor; // Return valid CompetitorModel
                }

                return null; // Return null for unmatched registrations
            })
            .filter((item): item is CompetitorModel => item !== null); // Filter null values

        return competitorsMapped;
    }
}
