import {
   customQuery
} from '../../../Core/Services/EntityGateway';

export const loadUserGridViews = async (cid) => {

    const userGridViewData = await customQuery(`user-grid-view`, `
            query{
                userGridViews(id:"`+ cid + `") {
                userGridViewID
                viewName
                columnData  
                createdBy
                createdDate
                filterData
                isDefault
                isSystem
                modifiedBy
                modifiedDate
                screenName
                userGridViewID
                viewName
                }
            }
    `);

    return userGridViewData;
};

