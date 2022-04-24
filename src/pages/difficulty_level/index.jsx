import * as React from 'react';
import { Box, Tooltip, Button, Dialog, DialogActions, DialogContent, IconButton, DialogTitle, TextField, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { OPEN_SNACKBAR } from '../../store/common';
import { useDispatch } from 'react-redux';

const DifficultyLevel = () => {
    const dispatch = useDispatch();
    const [items, setBatchType] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState({});

    const getDifficultyLevel = React.useCallback(() => {
        http.get(`/api/difficulty-level`).then((res) => {
            setBatchType(res.data);
        });
    }, []);

    React.useEffect(() => {
        getDifficultyLevel();
    }, [getDifficultyLevel]);

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
        var data = { name: f.get('name'), description: f.get('description') };
        if (form?._id) {
            http.put(`/api/difficulty-level/${form?._id}`, data).then((res) => {
                getDifficultyLevel();
                dispatch(OPEN_SNACKBAR({ message: 'Difficulty Level Update Successfully.' }));
                handleClose();
            })
        } else {
            http.post('/api/difficulty-level', data).then((res) => {
                getDifficultyLevel();
                dispatch(OPEN_SNACKBAR({ message: 'New Difficulty Level Added.' }));
                handleClose();
            })
        }
    };

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Tooltip title="Add Difficulty Level">
                    <Button variant="contained" endIcon={<AddIcon />} onClick={handleClickOpen}>
                        <Hidden only={'xs'}>Add Difficulty Level</Hidden>
                    </Button>
                </Tooltip>
            </React.Fragment>
        } />
        <Dialog open={open} fullWidth maxWidth={'sm'}>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                <DialogTitle>{form?._id ? 'Edit' : 'Add '} Difficulty Level</DialogTitle>
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

export default DifficultyLevel;
