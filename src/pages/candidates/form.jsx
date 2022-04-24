import * as React from 'react';
import { Paper, Box, Typography, Grid, TextField, Button, Autocomplete } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import http from "../../utils/http";
import { OPEN_SNACKBAR } from '../../store/common';

const Form = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = React.useState({ sector: '', jobrole: '', batch: '', name: "", father_name: '', mobile: '' });
    const [sectors, setSector] = React.useState([]);
    const [jobroles, setJobrole] = React.useState([]);
    const [batch, setBatch] = React.useState([]);

    const getCandidate = React.useCallback(() => {
        if (id) {
            http.get(`/api/candidate/${id}`).then((res) => setForm(res.data));
        }
    }, [id]);

    const getSector = React.useCallback(() => {
        http.get('/api/sector').then((res) => setSector(res.data));
    }, []);

    React.useEffect(() => {
        getSector();
        getCandidate();
    }, [getSector, getCandidate]);

    const handleChange = (e, v) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleChangeName = (v, name) => {
        if (name === 'sector') {
            setForm({ ...form, jobrole: '', batch: '' });
            setJobrole([]);
            setBatch([]);
            if (v?._id) {
                http.get(`/api/sector/jobrole/${v?._id}`).then((res) => setJobrole(res.data));
            }
        }
        if (name === 'jobrole') {
            setForm({ ...form, batch: '' });
            setBatch([]);
            if (v?._id) {
                http.get(`/api/jobrole/batch/${v?._id}`).then((res) => setBatch(res.data));
            }
        }
        setForm({ ...form, [name]: v });
    };

    const onSubmit = (event) => {
        event.preventDefault();
        var data = { ...form };
        data['name'] = form?.name;
        data['father_name'] = form?.father_name;
        data['mobile'] = form?.mobile;
        data['sector'] = form?.sector?._id;
        data['jobrole'] = form?.jobrole?._id;
        data['batch'] = form?.batch?._id;
        if (form?._id) {
            http.put(`/api/candidate/${form?._id}`, data).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'Candidate Update Successfully.' }));
                navigate(`/candidate/${form?.batch?._id}/list`);
            })
        } else {
            http.post('/api/candidate', data).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'New Candidate Added.' }));
                navigate('/candidate');
            })
        }
    };

    return <React.Fragment>
        <Paper className='p-5'>
            <Typography>{id ? 'Edit' : 'Add'} Candidate</Typography>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                <Box className='mb-4'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4} mb={3}>
                            <Autocomplete
                                id="sector"
                                required
                                value={form?.sector || ''}
                                options={sectors}
                                className="w-full"
                                getOptionLabel={(option) => option ? option.name : ''}
                                renderInput={(params) => <TextField {...params} variant="standard" label="Sector" />}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.name}
                                    </Box>
                                )}
                                onChange={(e, v) => handleChangeName(v, 'sector')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} mb={3}>
                            <Autocomplete
                                id="jobrole"
                                required
                                value={form?.jobrole || ''}
                                options={jobroles}
                                className="w-full"
                                getOptionLabel={(option) => option ? option.name : ''}
                                renderInput={(params) => <TextField {...params} variant="standard" label="Jobrole" />}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.name}
                                    </Box>
                                )}
                                onChange={(e, v) => handleChangeName(v, 'jobrole')}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} mb={3}>
                            <Autocomplete
                                id="batch"
                                required
                                value={form?.batch || ''}
                                options={batch}
                                className="w-full"
                                getOptionLabel={(option) => option ? option.name : ''}
                                renderInput={(params) => <TextField {...params} variant="standard" label="Batch" />}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.batch_id} ({option.name})
                                    </Box>
                                )}
                                onChange={(e, v) => setForm({ ...form, batch: v })}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} mb={3}>
                            <TextField
                                id="name"
                                name="name"
                                label="Name"
                                fullWidth
                                variant="standard"
                                value={form?.name || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} mb={3}>
                            <TextField
                                id="mobile"
                                name="mobile"
                                label="Mobile"
                                fullWidth
                                variant="standard"
                                value={form?.mobile || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} mb={3}>
                            <TextField
                                id="father_name"
                                name="father_name"
                                label="Father Name"
                                fullWidth
                                variant="standard"
                                value={form?.father_name || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Box className='mb-4 flex justify-end'>
                    <Button variant='contained' type='submit' >Save</Button>
                </Box>
            </Box>
        </Paper>
    </React.Fragment>
};

export default Form;