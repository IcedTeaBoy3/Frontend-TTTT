export const formatValue = (value) => {
    if (value === null || value === undefined || value === '' || value === 'null') {
        return '--';
    }
    return value;
};