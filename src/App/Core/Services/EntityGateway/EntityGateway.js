import {
    execute,
    executeGQLQuery
} from './graphql';

export function search(view, filters) {

}

export function get(id, form) {

}

export async function customQuery(schema,query) {
    const result = await execute(schema,query);
    return result.data;
};

export async function customGQLQuery(schema, query) {
    try {
        
        const result = await executeGQLQuery(schema, query);
        return result;
    }catch (e)
    {
        //alert(e);
    }
};