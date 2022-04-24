import * as React from 'react';
import { Box, Tooltip, Button, Dialog, DialogActions, DialogContent, IconButton, DialogTitle, TextField, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { OPEN_SNACKBAR } from '../../store/common';
import { SET_ROLES, SET_PERMISSIONS } from '../../store/users';
import { useDispatch, useSelector } from 'react-redux';

const Role = () => {
    const dispatch = useDispatch();
    const items = useSelector(state => state.users.roles);
    const permissions = useSelector(state => state.users.permissions);
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState({ name: "", description: "", permissions: [] });

    const getPermissions = React.useCallback(() => {
        http.get('/api/role/permissions').then((res) => dispatch(SET_PERMISSIONS(res.data)));
    }, [dispatch]);

    const getRoles = React.useCallback(() => {
        http.get('/api/role').then((res) => dispatch(SET_ROLES(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getRoles();
        getPermissions();
    }, [getPermissions, getRoles]);

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

    const handleClickOpen = (row = null) => {
        if (row) {
            setForm(row);
        }
        setOpen(true);
    };

    const handleChange = (e, v) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        setForm({ name: '', description: '', permissions: [] });
        setOpen(false);
    };

    const handleToggle = (value) => () => {
        if (form.permissions?.length > 0) {
            const currentIndex = form.permissions.indexOf(value);
            const newChecked = [...form.permissions];
            if (currentIndex === -1) {
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }

            setForm({ ...form, permissions: newChecked })
        } else {
            setForm({ ...form, permissions: [value] })
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const f = new FormData(event.currentTarget);
        var data = { name: f.get('name'), description: f.get('description'), permissions: form.permissions };
        if (form?._id) {
            http.put(`/api/role/${form?._id}`, data).then((res) => {
                getRoles();
                dispatch(OPEN_SNACKBAR({ message: 'Role Update Successfully.' }));
                handleClose();
            })
        } else {
            http.post('/api/role', data).then((res) => {
                getRoles();
                dispatch(OPEN_SNACKBAR({ message: 'New Role Added.' }));
                handleClose();
            })
        }
    };

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Tooltip title="Add New Role">
                    <Button style={{ display: 'none' }} variant="contained" endIcon={<AddIcon />} onClick={handleClickOpen}>
                        Add New Role
                    </Button>
                </Tooltip>
            </React.Fragment>
        } />
        <Dialog open={open} scroll={'paper'} fullWidth={true} maxWidth={'sm'}>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                <DialogTitle>{form?._id ? 'Edit' : 'Add New'} Role</DialogTitle>
                <DialogContent>
                    <Box className='mb-4'>
                        <TextField
                            autoFocus
                            id="name"
                            name="name"
                            label="Name"
                            fullWidth
                            disabled={form?.id !== '' ? true : false}
                            variant="standard"
                            value={form?.name || ''}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box className='mb-4'>
                        <TextField
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={2}
                            fullWidth
                            variant="standard"
                            value={form?.description || ''}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box className='w-full'>
                        <Typography variant="h6" gutterBottom component="div">
                            Permissions
                        </Typography>
                        {permissions.length > 0 && permissions.map((group, ind) => (
                            <FormControl className='md:w-1/2' component="fieldset" key={ind}>
                                <FormLabel component="legend">{group.name}</FormLabel>
                                <FormGroup>
                                    {group.permissions.length > 0 && group.permissions.map((permission, idx) => (
                                        <FormControlLabel key={idx}
                                            value={permission.slug}
                                            control={<Checkbox checked={form.permissions?.length > 0 && form.permissions?.indexOf(permission.slug) !== -1} name="permissions" onChange={handleToggle(permission.slug)} />}
                                            label={permission.name}
                                            labelPlacement="end"
                                        />
                                    ))}
                                </FormGroup>
                            </FormControl>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type='submit' >Save</Button>
                </DialogActions>
            </Box>
        </Dialog>
    </React.Fragment>
}

export default Role;