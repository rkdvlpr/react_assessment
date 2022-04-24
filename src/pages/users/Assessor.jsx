import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Button, IconButton, Avatar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { OPEN_SNACKBAR } from '../../store/common';
import { SET_ASSESSOR } from '../../store/users';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import AssessorFormModel from './AssessorFormModel';

const Assesor = () => {
    const dispatch = useDispatch();
    const items = useSelector(state => state.users.assessors);
    const [open, setOpen] = React.useState(false);
    const [editId, setEditId] = React.useState('');

    const getAssesors = React.useCallback(() => {
        http.get('/api/user/assessor').then((res) => dispatch(SET_ASSESSOR(res.data)));
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
                    return (<IconButton onClick={() => handleClickOpen(row.original?._id)} aria-label="edit" color="primary">
                        <EditIcon />
                    </IconButton>)
                }
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        {
            Header: 'Profile', accessor: d => {
                return <Avatar alt={d.name} src={d?.image ? d?.image : '/profile.png'} />
            }, disableSortBy: true
        },
        { Header: 'Username', accessor: 'username' },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Email', accessor: 'email' },
        { Header: 'Mobile No.', accessor: 'mobile' }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    const handleClickOpen = (id = '') => {
        setEditId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setEditId('');
        setOpen(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (editId) {
            http.put(`api/user/assessor/${editId}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                getAssesors();
                setEditId('');
                setOpen(false);
                dispatch(OPEN_SNACKBAR({ message: 'Assessor Update Successfully.' }));
            })
        } else {
            http.post('/api/user/assessor', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                getAssesors();
                setOpen(false);
                dispatch(OPEN_SNACKBAR({ message: 'New Assessor Added.' }));
            })
        }
    };

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Tooltip title="Add New Assessor">
                    <Button variant="contained" endIcon={<AddIcon />} onClick={() => handleClickOpen()}>
                        Add New Assessor
                    </Button>
                </Tooltip>
            </React.Fragment>
        } />
        <AssessorFormModel open={open} onClose={handleClose} onSubmit={handleSubmit} id={editId} />
    </React.Fragment>
}

export default Assesor;