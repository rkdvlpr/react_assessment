import * as React from 'react';
import { Tooltip, Button, IconButton, Box, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ListIcon from '@mui/icons-material/List';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { SET_BATCH } from '../../store/sector';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CandidateBatchList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(state => state.sector.batches);

    const getBatch = React.useCallback(() => {
        http.get('/api/candidate/batch').then((res) => dispatch(SET_BATCH(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getBatch();
    }, [getBatch]);

    const tableHooks = (hooks) => {
        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "",
                Header: "Action",
                accessor: "_id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<Box>
                        <IconButton onClick={() => navigate(`/candidate/${row.original?._id}/list`)} aria-label="list" color="primary">
                            <ListIcon />
                        </IconButton>
                    </Box>
                    )
                }
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        { Header: 'Batch ID', accessor: 'batch_id' },
        { Header: 'Batch Name', accessor: 'name' },
        { Header: 'City', accessor: 'city.name' },
        { Header: 'Type', accessor: 'batch_type.name' },
        { Header: 'Total Candidate', accessor: 'candidates' }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Box>
                    <Tooltip title="Add New Batch">
                        <Button variant="contained" endIcon={<AddIcon />} onClick={() => navigate('/candidate/add')}>
                            <Hidden only={'xs'}>Add New Candidate</Hidden>
                        </Button>
                    </Tooltip>
                </Box>
                <Box ml={2}>
                    <Tooltip title="Import Batch">
                        <Button variant="contained" endIcon={<FileUploadIcon />} onClick={() => navigate('/candidate/import')}>
                            <Hidden only={'xs'}>Import Candidate</Hidden>
                        </Button>
                    </Tooltip>
                </Box>
            </React.Fragment>
        } />
    </React.Fragment>
}

export default CandidateBatchList;