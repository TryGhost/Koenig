export const determineSegment = (visibility) => {
    if (visibility.freeMembers && visibility.paidMembers) {
        return null;
    } else if (visibility.freeMembers) {
        return 'status:free';
    } else if (visibility.paidMembers) {
        return 'status:paid';
    } else {
        return null;
    }
};
