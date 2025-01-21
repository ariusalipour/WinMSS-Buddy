import { useAppContext } from '../context/AppContext';
import {MatchModel} from "../models/MatchModel.ts";

export class MatchController {
    private context = useAppContext();

    getMatchNames(): MatchModel[] {
        const matches = this.context.processedData?.matches || [];
        return matches.map(match => ({
            matchId: match.matchId,
            matchName: match.matchName,
        }));
    }
}
