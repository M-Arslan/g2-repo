
export class MockGraphCommunication {
    constructor() {
        this.query = '';
        this.endpoint = '';
    }

    async execute(endpoint, query) {
        this.endpoint = endpoint;
        this.query = query;

        return {
            data: {
                operation: {
                    endpoint,
                    query,
                }
            }
        };
    }
}