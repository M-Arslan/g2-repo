import {
    customGQLQuery
} from '../../../Core/Services/EntityGateway';

export const loadHelpTags = async (helpContainerTypeDesc) => {
    let query = {
        "query": `
            query {
               list(helpContainerTypeDesc:"${helpContainerTypeDesc}")
                { 
                    content
                    createdBy
                    createdDate
                    helpContainerTypeID
                    helpID
                    parentHelpID
                    title
                    helpTagString
                    helpTags
                    {
                        helpTagText
                    }
                }
            }
            `
    }

    return await customGQLQuery(`help`, query);
};

export const findHelpTextByTag = (tagName, helpList) => {

    function findHelp(item) {
        return item.helpTags.findIndex(findTag) > -1;
    }

    function findTag(helpItem) {
        return tagName === helpItem.helpTagText;
    }

    try {
        let index = helpList.findIndex(findHelp);
        if (index > -1)
            return helpList[index].content;
    } catch (e) {
        console.log(e);

    }
    return "";
}

