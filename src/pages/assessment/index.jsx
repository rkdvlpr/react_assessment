import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Button, IconButton, Box, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { SET_ASSESSMENT } from '../../store/assessment';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { useNavigate } from 'react-router-dom';
import moment from "moment";

const Assessment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(state => state.assessment.items);

    const getAssessments = React.useCallback(() => {
        http.get('/api/assessment').then((res) => dispatch(SET_ASSESSMENT(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getAssessments()
    }, [getAssessments]);

    const tableHooks = (hooks) => {
        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "action",
                Header: "Action",
                accessor: "_id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<IconButton onClick={() => navigate(`/assessment/${row.original?._id}/edit`)} aria-label="edit" color="primary">
                        <EditIcon />
                    </IconButton>)
                }
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        { Header: 'Batch ID', accessor: 'batch.batch_id' },
        { Header: 'Assessment Name', accessor: 'name' },
        { Header: 'Mcq Language', accessor: d => d.mcq_language.map(v => v.name).join(', ') },
        { Header: 'Viva Language', accessor: 'viva_language.name' },
        { Header: 'Assessment Type', accessor: 'type' },
        { Header: 'Assessment Set', accessor: d => d.sets.length },
        { Header: 'Start Date', accessor: d => moment(d.start_date).format('YYYY-MMM-DD H:s A') },
        { Header: 'End Date', accessor: d => moment(d.end_date).format('YYYY-MMM-DD H:s A') },
        { Header: 'Duration', accessor: 'strategy.duration' },
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Box>
                    <Tooltip title="Add New Assessment">
                        <Button variant="contained" endIcon={<AddIcon />} onClick={() => navigate('/assessment/add')}>
                            <Hidden only={'xs'}>Add New Assessment</Hidden>
                        </Button>
                    </Tooltip>
                </Box>
            </React.Fragment>
        } />
    </React.Fragment>
}

export default Assessment;