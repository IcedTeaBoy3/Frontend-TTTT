
export const convertGender = (gender) =>{
    switch (gender) {
        case 'male':
            return 'Nam';
        case 'female':
            return 'Nữ';
        case 'other':
            return 'Khác';
        default:
            return '--';
    }
}