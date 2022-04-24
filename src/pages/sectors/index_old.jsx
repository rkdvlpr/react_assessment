import * as React from 'react';
import { Box, Tooltip, Button, Dialog, DialogActions, DialogContent, IconButton, DialogTitle, TextField, Grid, FormLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { OPEN_SNACKBAR } from '../../store/common';
import { SET_SECTOR } from '../../store/sector';
import { useDispatch, useSelector } from 'react-redux';

const Sector = () => {
    const dispatch = useDispatch();
    const items = useSelector(state => state.sector.sectors);
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState({ name: "", short_name: "" });
    const [persons, setPerson] = React.useState([]);

    const getSectors = React.useCallback(() => {
        http.get('api/sector').then((res) => dispatch(SET_SECTOR(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getSectors();
    }, [getSectors]);

    const addPerson = () => {
        var p = [...persons];
        p.push({ name: '', email: '', designation: '' });
        setPerson(p);
    }
    const removePerson = (i) => {
        var p = [...persons];
        p.splice(i, 1);
        setPerson(p);
    }

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
        { Header: 'Short Name', accessor: 'short_name' }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    const handleClickOpen = (row = null) => {
        if (row) {
            setForm(row);
            setPerson(row?.persons || []);
        }
        setOpen(true);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePersonChange = (e, k, i) => {
        let p = [...persons];
        p[i][k] = e.target.value;
        setPerson(p);
    };

    const handleClose = () => {
        setForm({ name: '', short_name: '' });
        setPerson([]);
        setOpen(false);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const f = new FormData(event.currentTarget);
        var data = { name: f.get('name'), short_name: f.get('short_name'), persons: persons };
        if (form?._id) {
            http.put(`api/sector/${form?._id}`, data).then((res) => {
                getSectors();
                dispatch(OPEN_SNACKBAR({ message: 'Sector Update Successfully.' }));
                handleClose();
            })
        } else {
            http.post('api/sector', data).then((res) => {
                getSectors();
                dispatch(OPEN_SNACKBAR({ message: 'New Sector Added.' }));
                handleClose();
            })
        }
    };

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Tooltip title="Add New Sector">
                    <Button variant="contained" endIcon={<AddIcon />} onClick={handleClickOpen}>
                        Add New Sector
                    </Button>
                </Tooltip>
            </React.Fragment>
        } />
        <Dialog open={open} scroll={'paper'} fullWidth={true} maxWidth={'md'}>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                <DialogTitle>{form?._id ? 'Edit' : 'Add New'} Sector</DialogTitle>
                <DialogContent>
                    <Box className='mb-4'>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    autoFocus
                                    id="name"
                                    name="name"
                                    label="Name"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={form?.name || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="short_name"
                                    name="short_name"
                                    label="Short Name"
                                    required
                                    fullWidth
                                    variant="standard"
                                    value={form?.short_name || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className='mb-4'>
                        {persons?.length > 0 && persons?.map((person, idx) => (
                            <Box className='relative' key={idx} sx={{ p: 2 }} component="fieldset" variant="standard" style={{ borderColor: '#ccc', borderWidth: 1.5 }}>
                                <FormLabel component="legend">Person {idx + 1}</FormLabel>
                                {idx > 0 && <Box className='absolute top-0 right-0 cursor-pointer' onClick={e => removePerson(idx)} component="span"><ClearIcon color='error' /></Box>}
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            name="persons[name][]"
                                            label="Name"
                                            fullWidth
                                            variant="standard"
                                            value={person.name || ''}
                                            onChange={(e) => handlePersonChange(e, 'name', idx)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            name="persons[email][]"
                                            label="Email"
                                            type={'email'}
                                            fullWidth
                                            variant="standard"
                                            value={person.email || ''}
                                            onChange={(e) => handlePersonChange(e, 'email', idx)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <TextField
                                            name="persons[designation][]"
                                            label="Designation"
                                            fullWidth
                                            variant="standard"
                                            value={person.designation || ''}
                                            onChange={(e) => handlePersonChange(e, 'designation', idx)}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Box>
                    <Box className='mb-4'>
                        <Button onClick={addPerson}>Add Person</Button>
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

export default Sector;