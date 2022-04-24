import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Button, IconButton, Box, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { SET_ASSESSOR } from '../../store/users';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { useNavigate } from 'react-router-dom';

const Assesor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(state => state.users.assessors);

    const getAssesors = React.useCallback(() => {
        http.get('/api/assessor').then((res) => dispatch(SET_ASSESSOR(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getAssesors()
    }, [getAssesors]);

    const tableHooks = (hooks) => {
        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "action",
                Header: "Action",
                accessor: "_id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<IconButton onClick={() => navigate(`/assessor/${row.original?._id}/edit`)} aria-label="edit" color="primary">
                        <EditIcon />
                    </IconButton>)
                }
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        { Header: 'AssessorID', accessor: 'username' },
        { Header: 'Password', accessor: 'password_text' },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Mobile No.', accessor: 'mobile' }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Box>
                    <Tooltip title="Add New Assessor">
                        <Button variant="contained" endIcon={<AddIcon />} onClick={() => navigate('/assessor/add')}>
                            <Hidden only={'xs'}>Add New Assessor</Hidden>
                        </Button>
                    </Tooltip>
                </Box>
                <Box ml={2}>
                    <Tooltip title="Import Assessor">
                        <Button variant="contained" endIcon={<FileUploadIcon />} onClick={() => navigate('/assessor/import')}>
                            <Hidden only={'xs'}>Import Assessor</Hidden>
                        </Button>
                    </Tooltip>
                </Box>
            </React.Fragment>
        } />
    </React.Fragment>
}

export default Assesor;