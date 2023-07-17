import {
    GQL_SCHEMAS,
    GraphOperation
} from "../../../../../Providers/GraphQL";
import {
    customGQLQuery
} from '../../../../../Services/EntityGateway';

export class GetCheckExaminerForAdjusterLicenseState extends GraphOperation {

    constructor() {
        super(GQL_SCHEMAS.CheckExaminerForAdjusterLicenseState, 'get');
        this.defineVariable('examinerID', 'String', true)
            .defineVariable('state', 'String', true);
        this.shouldCache(`${GQL_SCHEMAS.CheckExaminerForAdjusterLicenseState}`);
    }
}

export const checkExaminerForAdjusterLicenseStateQuery = async (examinerID, state) =>
{
    const query = {
        "query": "query($examinerID:String!,$state:String!) {get(examinerID:$examinerID,state:$state)}",
        "variables": { "examinerID": examinerID, "state": state }
    }

    return await customGQLQuery(GQL_SCHEMAS.CheckExaminerForAdjusterLicenseState, query);

}