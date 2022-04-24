import * as React from 'react';
import { Paper, Box, Typography, Grid, TextField, Button, Autocomplete, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import http from "../../utils/http";
import { OPEN_SNACKBAR } from '../../store/common';
import { SET_SECTOR } from '../../store/sector';

const Form = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sectors = useSelector(state => state.sector.sectors);
    const { id } = useParams();
    const [form, setForm] = React.useState({ sector: '', jobrole: '', batch_id: '', name: "", batch_type: '', batch_scheme: '', start_date: new Date(), end_date: new Date(), assessment_date: new Date(), assignment_date: new Date(), center_name: '', center_address: '', state: '', city: '', poc_name: '', poc_number: '', vtp_name: '', vtp_email: '', candidates: '' });
    const [states, setStates] = React.useState([]);
    const [cities, setCities] = React.useState([]);
    const [jobroles, setJobrole] = React.useState([]);
    const [batch_types, setBatchTypes] = React.useState([]);
    const [schemes, setScheme] = React.useState([]);

    const getBatchTypes = React.useCallback(() => {
        http.get('/api/batch/type').then((res) => setBatchTypes(res.data));
    }, []);

    const getScheme = React.useCallback(() => {
        http.get('/api/batch/scheme').then((res) => setScheme(res.data));
    }, []);

    const getStates = React.useCallback(() => {
        http.get('/api/state').then((res) => setStates(res.data));
    }, []);

    const getSectors = React.useCallback(() => {
        http.get('/api/sector').then((res) => dispatch(SET_SECTOR(res.data)));
    }, [dispatch]);

    const getBatchById = React.useCallback(() => {
        if (id) {
            http.get(`/api/batch/${id}`).then((res) => {
                var f = { ...res.data };
                setForm(f);
                if (f?.sector?._id) {
                    http.get(`/api/sector/jobrole/${f?.sector?._id}`).then((res) => setJobrole(res.data));
                }
                if (f?.state?._id) {
                    http.get(`/api/state/${f?.state?._id}`).then((res) => setCities(res.data.cities));
                }
            });
        }
    }, [id]);

    React.useEffect(() => {
        getBatchTypes();
        getScheme();
        getStates();
        getSectors();
        getBatchById();
    }, [getBatchTypes, getScheme, getStates, getSectors, getBatchById]);

    const handleChange = (e, v) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleChangeName = (v, name) => {
        if (name === 'sector') {
            setForm({ ...form, jobrole: '' });
            setJobrole([]);
            if (v?._id) {
                http.get(`/api/sector/jobrole/${v?._id}`).then((res) => setJobrole(res.data));
            }
        }
        if (name === 'state') {
            setForm({ ...form, city: '' });
            setCities([]);
            if (v?._id) {
                http.get(`/api/state/${v?._id}`).then((res) => setCities(res.data.cities));
            }
        }
        setForm({ ...form, [name]: v });
    };

    const handleDatePickerChange = (e, key) => {
        setForm({ ...form, [key]: e });
    };

    const onSubmit = (event) => {
        event.preventDefault();
        // const f = new FormData(event.currentTarget);
        var data = { ...form };
        data['state'] = form?.state?._id;
        data['city'] = form?.city?._id;
        data['sector'] = form?.sector?._id;
        data['jobrole'] = form?.jobrole?._id;
        if (form?._id) {
            http.put(`/api/batch/${form?._id}`, data).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'Batch Update Successfully.' }));
                navigate('/batch');
            })
        } else {
            http.post('/api/batch', data).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'New Batch Added.' }));
                navigate('/batch');
            })
        }
    };

    return <React.Fragment>
        <LocalizationProvider dateAdapter={DateAdapter}>
            <Paper className='p-5'>
                <Typography>{id ? 'Edit' : 'Add'} Batch</Typography>
                <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                    <Box className='mb-4'>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4} mb={3}>
                                <TextField
                                    id="batch_id"
                                    name="batch_id"
                                    label="Batch ID"
                                    fullWidth
                                    variant="standard"
                                    value={form?.batch_id || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <TextField
                                    id="batch_name"
                                    name="name"
                                    label="Batch Name"
                                    fullWidth
                                    variant="standard"
                                    value={form?.name || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="batch_type">Batch type</InputLabel>
                                    <Select
                                        labelId="batch_type"
                                        id="batch_type"
                                        value={form?.batch_type}
                                        onChange={(e) => setForm({ ...form, batch_type: e.target.value })}
                                        label="Batch type"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {batch_types.map((v, idx) => <MenuItem key={idx} value={v._id}>{v.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel id="batch_scheme">Project category</InputLabel>
                                    <Select
                                        labelId="batch_scheme"
                                        id="batch_scheme"
                                        value={form?.batch_scheme}
                                        onChange={(e) => setForm({ ...form, batch_scheme: e.target.value })}
                                        label="Project category"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {schemes.map((v, idx) => <MenuItem key={idx} value={v._id}>{v.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <FormControl fullWidth>
                                    <DatePicker
                                        id="start_date"
                                        name="start_date"
                                        label="Batch Start Date"
                                        value={form?.start_date || ''}
                                        onChange={(e) => handleDatePickerChange(e, 'start_date')}
                                        renderInput={(params) => <TextField {...params} variant="standard" />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <FormControl fullWidth>
                                    <DatePicker
                                        id="end_date"
                                        name="end_date"
                                        label="Batch End Date"
                                        value={form?.end_date || ''}
                                        onChange={(e) => handleDatePickerChange(e, 'end_date')}
                                        renderInput={(params) => <TextField {...params} variant="standard" />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <Autocomplete
                                    id="sector"
                                    required
                                    value={form.sector}
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
                                    value={form.jobrole}
                                    options={jobroles}
                                    className="w-full"
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    renderInput={(params) => <TextField {...params} variant="standard" label="Jobrole" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    onChange={(e, v) => setForm({ ...form, jobrole: v })}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <FormControl fullWidth>
                                    <DatePicker
                                        id="assessment_date"
                                        name="assessment_date"
                                        label="Assessment date"
                                        value={form?.assessment_date || ''}
                                        onChange={(e) => handleDatePickerChange(e, 'assessment_date')}
                                        renderInput={(params) => <TextField {...params} variant="standard" />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <FormControl fullWidth>
                                    <DatePicker
                                        id="assignment_date"
                                        name="assignment_date"
                                        label="Assignment date"
                                        value={form?.assignment_date || ''}
                                        onChange={(e) => handleDatePickerChange(e, 'assignment_date')}
                                        renderInput={(params) => <TextField {...params} variant="standard" />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <Autocomplete
                                    id="state"
                                    required
                                    value={form.state}
                                    options={states}
                                    className="w-full"
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    renderInput={(params) => <TextField {...params} variant="standard" label="State" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    onChange={(e, v) => handleChangeName(v, 'state')}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <Autocomplete
                                    id="city"
                                    required
                                    value={form.city}
                                    options={cities}
                                    className="w-full"
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    renderInput={(params) => <TextField {...params} variant="standard" label="City" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    onChange={(e, v) => setForm({ ...form, city: v })}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <TextField
                                    id="center_name"
                                    name="center_name"
                                    label="Center Name"
                                    fullWidth
                                    variant="standard"
                                    value={form?.center_name || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={8} mb={3}>
                                <TextField
                                    id="center_address"
                                    name="center_address"
                                    label="Center Address"
                                    fullWidth
                                    multiline
                                    variant="standard"
                                    value={form?.center_address || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <TextField
                                    id="poc_name"
                                    name="poc_name"
                                    label="POC Contact Name"
                                    fullWidth
                                    variant="standard"
                                    value={form?.poc_name || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <TextField
                                    id="poc_number"
                                    name="poc_number"
                                    label="POC Contact Number"
                                    fullWidth
                                    variant="standard"
                                    value={form?.poc_number || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <TextField
                                    id="vtp_name"
                                    name="vtp_name"
                                    label="VTP Name"
                                    fullWidth
                                    variant="standard"
                                    value={form?.vtp_name || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <TextField
                                    id="vtp_email"
                                    name="vtp_email"
                                    label="VTP Email"
                                    fullWidth
                                    variant="standard"
                                    value={form?.vtp_email || ''}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <TextField
                                    id="candidates"
                                    name="candidates"
                                    label="Number Of Candidate"
                                    fullWidth
                                    variant="standard"
                                    value={form?.candidates || ''}
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
        </LocalizationProvider>
    </React.Fragment>
};

export default Form;