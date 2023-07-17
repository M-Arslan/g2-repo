
export function execute(schema, query) {

    const uri = `${window.location.protocol}//${window.location.host}/gql/${schema}`;
    return fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
        }),
    })
    .then(response => {
        return response.json()
    });
}
export function executeGQLQuery(schema,query) {

    const uri = `${window.location.protocol}//${window.location.host}/gql/${schema}`;
    return fetch(uri, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
    })
        .then(response => {
            return response.json()
        });
}