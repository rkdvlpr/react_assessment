import * as React from 'react';
import { useParams } from 'react-router-dom';
import http from "../../utils/http";
import { OPEN_SNACKBAR } from '../../store/common';
import { Paper, Typography } from '@mui/material';

const GenerateForm = () => {
    const { id } = useParams();
    const sets = sessionStorage.getItem('generateSet') ? JSON.stringify(sessionStorage.getItem('generateSet')) : {};
    const [strategy, setStrategy] = React.useState({});
    const getStrategy = React.useCallback(() => {
        if (id) {
            http.get(`/api/strategy/${id}`).then((res) => setStrategy(res.data.strategy));
        }
    }, [id]);

    React.useEffect(() => {
        getStrategy();
    }, [getStrategy]);

    console.log(sets);

    return <React.Fragment>
        <Paper className='p-5'>
            <Typography>Generate Assessment Sets</Typography>
            <Typography>{sets?.name}</Typography>
            <Typography>{sets?.number}</Typography>
        </Paper>
    </React.Fragment>
};

export default GenerateForm;