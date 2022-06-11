
// приводить дані з Firebase до формату, як у бекенді з фільмами
/**
 * @param {Object} dataObj // JS об'єкт з Firebase
 * @returns {Array} // масив об'єктів з фільмами
 */ 
const transform = (dataObj = {}) =>
    dataObj
        ? Object.keys(dataObj).map(key => ({
                dbId: key,
                ...parse(dataObj[key]),
            }))
        : [];

// перетворює JS об'єкт у JSON
/**
* @param {Object} obj // має отримувати JS об'єкт 
* @returns 
*/
const stringify = (obj = {}) => {
    try {
        return obj ? JSON.stringify(obj) : {};
    } catch (error) {
        console.log(`JSON stringify error: ${error}`);
    }
}
// перетворює JSON у JS об'єкт
/**
* @param {JSON} json // на вході має бути JSON
* @returns {Object} // на виході має бути JS об'єкт
*/
function parse (json = {}) {
    try {
        return json ? JSON.parse(json) : {};
    } catch (error) {
        console.log(`JSON parse error: ${error}`);
    }
}

export const serialaize = {
transform,
parse,
stringify,
}