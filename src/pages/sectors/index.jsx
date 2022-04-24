import * as React from 'react';
import { Box, Button, IconButton, TextField, Grid, FormLabel, Paper, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { OPEN_SNACKBAR } from '../../store/common';
import { SET_SECTOR } from '../../store/sector';
import { useDispatch, useSelector } from 'react-redux';

const Sector = () => {
    const dispatch = useDispatch();
    const items = useSelector(state => state.sector.sectors);
    // const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState({ name: "", short_name: "" });
    const [persons, setPerson] = React.useState([]);

    const getSectors = React.useCallback(() => {
        http.get('api/sector').then((res) => dispatch(SET_SECTOR(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getSectors();
        setPerson([{ name: '', email: '', designation: '' }, { name: '', email: '', designation: '' }])
    }, [getSectors]);

    const addPerson = () => {
        var p = [...persons];
        p.push({ name: '', email: '', designation: '' });
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
        // setOpen(true);
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
        setPerson([{ name: '', email: '', designation: '' }, { name: '', email: '', designation: '' }]);
        // setOpen(false);
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
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <Paper className='p-2'>
                    <Typography variant="h6">{form?._id ? 'Edit' : 'Add'} Sector</Typography>
                    <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                        <Box className='mb-4'>
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
                        </Box>
                        <Box className='mb-4'>
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

                        </Box>
                        <Box className='mb-4'>
                            {persons?.length > 0 && persons?.map((person, idx) => (
                                <Box className='relative mt-4' key={idx} sx={{ p: 2 }} component="fieldset" variant="standard" style={{ borderColor: '#ccc', borderWidth: 1.5 }}>
                                    <FormLabel component="legend">Person {idx + 1}</FormLabel>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                name="persons[name][]"
                                                label="Name"
                                                fullWidth
                                                variant="standard"
                                                value={person.name || ''}
                                                onChange={(e) => handlePersonChange(e, 'name', idx)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
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
                                        <Grid item xs={12}>
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
                        <Box className='mb-4 flex justify-end'>
                            <Box className='mr-4'>
                                <Button variant="contained" color='warning' onClick={handleClose}>{form?._id ? 'Cancel' : 'Reset'}</Button>
                            </Box>
                            <Button variant="contained" type='submit'>Save</Button>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
                <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={null} />
            </Grid>
        </Grid>
    </React.Fragment>
}

export default Sector;