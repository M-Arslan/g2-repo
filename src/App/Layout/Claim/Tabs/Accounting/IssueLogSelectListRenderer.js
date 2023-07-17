import { MenuItem } from '@mui/material';
//import { makeStyles } from '@mui/styles';
import React from 'react';
import { SelectList } from '../../../../Core/Forms/Common';
import { saveIssueLogs } from './Queries/saveIssueLogs';
import { CLAIM_STATUS_TYPE } from '../../../../Core/Enumerations/app/claim-status-type';

//const useStyles = makeStyles((theme) => ({
//    root: {
//        flex: 1,
//    },
//    paper: {
//        padding: '2em',
//    },
//    datepickerHeight: {
//        height: 25,
//    },
//    gridButton: {
//        paddingRight: '0px !important',
//        paddingLeft: '0px !important',
//    },
//    iconButton: {
//        paddingRight: '5px !important',
//        paddingLeft: '5px !important',
//    },
//    paper: {
//        position: 'absolute',
//        width: 500,
        
//        border: '1px solid #000',
//        padding: '2em',
//        overflowY: 'scroll',
//        maxHeight: 500
//    },
//}));


//function getModalStyle() {
//    const top = 50;
//    const left = 50;

//    return {
//        top: `${top}%`,
//        left: `${left}%`,
//        transform: `translate(-${top}%, -${left}%)`,
//    };
//}


export default function ({ node }) {
    const [value, setValue] = React.useState(node.data.claimStatusTypeID);

    const onValueChanged = (event) => {
        var request = node.data;
        request.claimStatusTypeID = node.data.claimStatusTypeID == CLAIM_STATUS_TYPE.OPEN.toString() ? CLAIM_STATUS_TYPE.CLOSED_PI_1.toString() : node.data.claimStatusTypeID == CLAIM_STATUS_TYPE.CLOSED_PI_1.toString() ? CLAIM_STATUS_TYPE.OPEN.toString() : CLAIM_STATUS_TYPE.CLOSED_PI_1.toString();
        request.claimStatusTypeID = parseInt(request.claimStatusTypeID);
        setValue(request.claimStatusTypeID);
        saveIssueLogs(request);
    }

    return (

        <span>
            <SelectList
                id="issueStatus"
                value={value}
                variant="outlined"
                onChange={onValueChanged}
                allowempty={false}
                required
            >
                <MenuItem value="3">Open</MenuItem>
                <MenuItem value="6">Close</MenuItem>
            </SelectList>
        </span>

    );

}

