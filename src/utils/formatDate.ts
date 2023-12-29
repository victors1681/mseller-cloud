import moment from "moment";

export const formatDate = (date: string) => {

    const userLanguage = navigator.language || navigator.userLanguage;
    moment.locale(userLanguage);

    const dateString = date //"2023-12-21T10:37:00Z";
    const formattedDate = moment(dateString).format('lll');

    return formattedDate;

}
export default formatDate;