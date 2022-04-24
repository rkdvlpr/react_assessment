import * as React from 'react';
import { Box, Tooltip, Button, Dialog, DialogActions, DialogContent, IconButton, DialogTitle, TextField, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { OPEN_SNACKBAR, SET_LANGUAGE } from '../../store/common';
import { useDispatch, useSelector } from 'react-redux';

const Language = () => {
    const dispatch = useDispatch();
    const items = useSelector(state => state.common.language);
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState({});

    const getLanguage = React.useCallback(() => {
        http.get(`/api/language`).then((res) => dispatch(SET_LANGUAGE(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getLanguage();
    }, [getLanguage]);

    const tableHooks = (hooks) => {
        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "",
                Header: "Action",
                accessor: "_id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<IconButton onClick={() => handleClickOpen(row.original)} aria-label="edit" color="primary">
                        <EditIcon />
                    </IconButton>)
                }
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        { Header: 'Name', accessor: 'name' },
        { Header: 'English Name', accessor: 'eng_name' },
        { Header: 'Short Name', accessor: 'slug' },
        { Header: 'Description', accessor: 'description' }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    const handleClickOpen = (data = {}) => {
        setForm(data);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm({});
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const f = new FormData(event.currentTarget);
        var data = { name: f.get('name'), slug: f.get('slug'), eng_name: f.get('eng_name'), description: f.get('description') };
        if (form?._id) {
            http.put(`/api/language/${form?._id}`, data).then((res) => {
                getLanguage();
                dispatch(OPEN_SNACKBAR({ message: 'Language Update Successfully.' }));
                handleClose();
            })
        } else {
            http.post('/api/language', data).then((res) => {
                getLanguage();
                dispatch(OPEN_SNACKBAR({ message: 'New Language Added.' }));
                handleClose();
            })
        }
    };

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Tooltip title="Add New Language">
                    <Button variant="contained" endIcon={<AddIcon />} onClick={handleClickOpen}>
                        <Hidden only={'xs'}>Add Language</Hidden>
                    </Button>
                </Tooltip>
            </React.Fragment>
        } />
        <Dialog open={open} fullWidth maxWidth={'sm'}>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                <DialogTitle>{form?._id ? 'Edit' : 'Add New'} Language</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Name"
                        fullWidth
                        value={form?.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        id="eng_name"
                        name="eng_name"
                        label="English Name"
                        fullWidth
                        value={form?.eng_name}
                        onChange={(event) => setForm({ ...form, eng_name: event.target.value })}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        id="slug"
                        name="slug"
                        label="Short Name"
                        fullWidth
                        value={form?.slug}
                        onChange={(event) => setForm({ ...form, slug: event.target.value })}
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        name="description"
                        label="Description"
                        fullWidth
                        multiline
                        value={form?.description}
                        onChange={(event) => setForm({ ...form, description: event.target.value })}
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button type='button' onClick={handleClose}>Cancel</Button>
                    <Button type='submit'>Save</Button>
                </DialogActions>
            </Box>
        </Dialog>
    </React.Fragment>
};

export default Language;
