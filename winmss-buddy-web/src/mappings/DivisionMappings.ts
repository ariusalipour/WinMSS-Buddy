export const getDivisionString = (division: number | undefined): string => {
    switch (division) {
        case 25:
            return 'Mini Rifle Open';
        case 26:
            return 'Mini Rifle Standard';
        case 29:
            return 'PCC Optics';
        case 24:
            return 'Production Optics';
        case 1:
            return 'Open';
        case 2:
            return 'Standard';
        case 18:
            return 'Classic';
        case 4:
            return 'Production';
        case 5:
            return 'Revolver';
        default:
            return String(division);
    }
}