import {
    GQL_SCHEMAS,
    GraphOperation
} from '../../../../Providers/GraphQL';
import {
    safeJsonParse
} from '../../../../Utility/safeObject';
import {
    TOKEN_KEY
} from '../AuthContext';
import {
    Buffer
} from 'buffer';

export class GetCurrentUser extends GraphOperation {
    constructor() {
        super(GQL_SCHEMAS.USER, 'user');

        this.defineVariable('id', 'String', true)
            .defineFields(
                'userID',
                'fullName',
                'emailAddress',
            );
    }

    async execute() {
        try {
            const response = await fetch(`${window.location.protocol}//${window.location.host}/api/auth`, {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const { token } = await response.json();
                localStorage.setItem(TOKEN_KEY, token);

                const payload = Buffer.from(token.split('.')[1], 'base64');
                localStorage.setItem('currentUser', payload);
                const authData = JSON.parse(payload);
                const user = await super.execute({ id: authData.id });

                return {
                    id: authData.id,
                    fullName: user.fullName,
                    emailAddress: user.emailAddress,
                    token,
                    permissions: safeJsonParse(authData.appRolePermissions)[1],
                    companies: safeJsonParse(authData.userCompanies)[1],
                    roles: safeJsonParse(authData.userRoles)[1],
                    authenticated: true,
                    authorized: true
                };
            } else {
                return { authenticated: true, authorized: false };
            }
        } catch (e) {
            console.error('Error on authorization:', e);
            return { authenticated: true, authorized: false };
        }

    }
}
