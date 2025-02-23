export const getCategoryString = (category: number | undefined): string => {
    switch (category) {
        case 0:
            return 'None';
        case 1:
            return 'Lady';
        case 2:
            return 'Junior';
        case 3:
            return 'Senior';
        case 4:
            return 'Super Senior';
        case 5:
            return 'Super Junior';
        default:
            return String(category);
    }
}