import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Button, IconButton, Box, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { SET_QUESTIONS } from '../../store/question';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { useNavigate } from 'react-router-dom';

const Question = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(state => state.question.items);

    const getQuestions = React.useCallback(() => {
        http.get('/api/question').then((res) => dispatch(SET_QUESTIONS(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getQuestions()
    }, [getQuestions]);

    const tableHooks = (hooks) => {
        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "action",
                Header: "Action",
                accessor: "_id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<IconButton onClick={() => navigate(`/question/${row.original?._id}/edit`)} aria-label="edit" color="primary">
                        <EditIcon />
                    </IconButton>)
                }
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        { Header: 'Sector', accessor: 'sector.name' },
        { Header: 'Jobrole', accessor: 'jobrole.name' },
        { Header: 'Nos ID', accessor: 'nos.name' },
        { Header: 'Difficulty level', accessor: 'difficulty_level.name' },
        { Header: 'Type', accessor: 'type' }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Box>
                    <Tooltip title="Add New Question">
                        <Button variant="contained" endIcon={<AddIcon />} onClick={() => navigate('/question/add')}>
                            <Hidden only={'xs'}>Add New Question</Hidden>
                        </Button>
                    </Tooltip>
                </Box>
                <Box ml={2}>
                    <Tooltip title="Import Question">
                        <Button variant="contained" endIcon={<FileUploadIcon />} onClick={() => navigate('/question/import')}>
                            <Hidden only={'xs'}>Import Question</Hidden>
                        </Button>
                    </Tooltip>
                </Box>
            </React.Fragment>
        } />
    </React.Fragment>
}

export default Question;