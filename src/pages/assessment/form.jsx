import * as React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, FormControl, Autocomplete, Box, Button, Paper, Typography, InputLabel, Select, MenuItem } from "@mui/material";
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import http from "../../utils/http";
import { OPEN_SNACKBAR, SET_LANGUAGE } from '../../store/common';
import { SET_SECTOR } from '../../store/sector';

const Form = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const sectors = useSelector(state => state.sector.sectors);
    const languages = useSelector(state => state.common.language);
    const [jobroles, setJobrole] = React.useState([]);
    const [strategy, setStrategy] = React.useState([]);
    const [batch, setBatch] = React.useState([]);
    const [assessor, setAssessor] = React.useState([]);
    const [form, setForm] = React.useState({
        sector: '',
        jobrole: '',
        strategy: '',
        sets: [],
        batch: '',
        assessor: '',
        name: '',
        start_date: '',
        end_date: '',
        mcq_language: [],
        viva_language: '',
        type: ''
    });

    const getSectors = React.useCallback(() => {
        http.get('/api/sector').then((res) => dispatch(SET_SECTOR(res.data)));
    }, [dispatch]);

    const getLanguage = React.useCallback(() => {
        http.get(`/api/language`).then((res) => {
            dispatch(SET_LANGUAGE(res.data));
        });
    }, [dispatch]);

    const getAssessment = React.useCallback(() => {
        if (id) {
            http.get(`/api/assessment/${id}`).then((res) => {
                setForm({ ...res.data, sets: res.data.strategy.sets.filter(v => res.data.sets.includes(v._id)) });
            });
        }
    }, [id]);

    React.useEffect(() => {
        getSectors();
        getLanguage();
        getAssessment();
    }, [getSectors, getLanguage, getAssessment]);

    const handleChangeName = (v, name, reason = null) => {
        if (name === 'sector') {
            setForm({ ...form, [name]: v, jobrole: '', strategy: '' });
            setJobrole([]);
            setStrategy([]);
            setAssessor([]);
            if (v?._id) {
                http.get(`/api/sector/jobrole/${v?._id}`).then((res) => setJobrole(res.data));
            }
        } else if (name === 'jobrole') {
            setForm({ ...form, [name]: v, strategy: '' });
            setStrategy([]);
            setAssessor([]);
            if (v?._id) {
                http.get(`/api/strategy/jobrole/${v?._id}`).then((res) => setStrategy(res.data));
                http.get(`/api/batch/jobrole/${v?._id}`).then((res) => setBatch(res.data));
                http.get(`/api/assessor/jobrole/${v?._id}`).then((res) => setAssessor(res.data));
            }
        } else if (name === 'batch') {
            setForm({ ...form, [name]: v, assessor: '' });
        } else {
            setForm({ ...form, [name]: v });
        }
    };

    const handleDatePickerChange = (e, key) => {
        setForm({ ...form, [key]: e });
    };

    const onSubmit = (event) => {
        event.preventDefault();
        var data = {};
        data['sector'] = form.sector._id;
        data['jobrole'] = form.jobrole._id;
        data['strategy'] = form.strategy._id;
        data['sets'] = form.sets.map(v => v._id);
        data['batch'] = form.batch._id;
        data['assessor'] = form.assessor._id;
        data['name'] = form.name;
        data['start_date'] = form.start_date;
        data['end_date'] = form.end_date;
        data['mcq_language'] = form.mcq_language.map(v => v._id);
        data['viva_language'] = form.viva_language._id;
        data['type'] = form.type;
        if (form?._id) {
            http.put(`/api/assessment/${form?._id}`, data).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'Assessment Update Successfully.' }));
                navigate('/assessment');
            })
        } else {
            http.post('/api/assessment', data).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'New Assessment Added.' }));
                navigate('/assessment');
            })
        }
    };

    return <React.Fragment>
        <LocalizationProvider dateAdapter={DateAdapter}>
            <Paper className='p-5'>
                <Typography>{id ? 'Edit' : 'Add'} Assessment</Typography>
                <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                    <Box className='mb-4'>
                        <Grid className="py-2" container spacing={{ xs: 2, md: 3 }}>
                            <Grid item xs={12} md={4} mb={3}>
                                <Autocomplete
                                    id="sector"
                                    required
                                    value={form.sector}
                                    options={sectors}
                                    className="w-full"
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                    renderInput={(params) => <TextField {...params} label="Sector" />}
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
                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                    renderInput={(params) => <TextField {...params} label="Jobrole" />}
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
                                    id="strategy"
                                    required
                                    value={form.strategy}
                                    options={strategy}
                                    className="w-full"
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                    renderInput={(params) => <TextField {...params} label="Strategy" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    onChange={(e, v) => handleChangeName(v, 'strategy')}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <Autocomplete
                                    id="sets"
                                    multiple
                                    required
                                    value={form?.sets}
                                    options={form?.strategy?.sets || []}
                                    className="w-full"
                                    disableClearable
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                    renderInput={(params) => <TextField {...params} label="Strategy Set" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    onChange={(e, v, r) => handleChangeName(v, 'sets', r)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <Autocomplete
                                    id="batch"
                                    required
                                    value={form.batch}
                                    options={batch}
                                    className="w-full"
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                    renderInput={(params) => <TextField {...params} label="Batch" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    onChange={(e, v) => handleChangeName(v, 'batch')}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <Autocomplete
                                    id="assessor"
                                    required
                                    value={form.assessor}
                                    options={assessor}
                                    className="w-full"
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                    renderInput={(params) => <TextField {...params} label="Assessor" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    onChange={(e, v) => handleChangeName(v, 'assessor')}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <TextField
                                    id="name"
                                    name="name"
                                    required
                                    label="Assessment Name"
                                    fullWidth
                                    value={form?.name || ''}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <FormControl fullWidth>
                                    <InputLabel id="type">Assessment Type</InputLabel>
                                    <Select
                                        labelId="type"
                                        id="type"
                                        required
                                        value={form?.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                        label="Assessment Type"
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value="online">Online</MenuItem>
                                        <MenuItem value="omr">OMR</MenuItem>
                                        <MenuItem value="mcq-practical">MCQ Practical</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <FormControl fullWidth>
                                    <DateTimePicker
                                        id="start_date"
                                        name="start_date"
                                        label="Start Date"
                                        value={form?.start_date || null}
                                        onChange={(e) => handleDatePickerChange(e, 'start_date')}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <FormControl fullWidth>
                                    <DateTimePicker
                                        id="end_date"
                                        name="end_date"
                                        label="End Date"
                                        value={form?.end_date || null}
                                        onChange={(e) => handleDatePickerChange(e, 'end_date')}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <Autocomplete
                                    id="mcq_language"
                                    multiple
                                    required
                                    value={form?.mcq_language}
                                    options={languages}
                                    className="w-full"
                                    disableClearable
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                    renderInput={(params) => <TextField {...params} label="Mcq Language" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    onChange={(e, v, r) => handleChangeName(v, 'mcq_language', r)}
                                />
                            </Grid>
                            <Grid item xs={12} md={4} mb={3}>
                                <Autocomplete
                                    id="viva_language"
                                    required
                                    value={form?.viva_language}
                                    options={languages}
                                    className="w-full"
                                    disableClearable
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    isOptionEqualToValue={(option, value) => option._id === value._id}
                                    renderInput={(params) => <TextField {...params} label="Viva Language" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    onChange={(e, v, r) => handleChangeName(v, 'viva_language', r)}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className='mb-4 flex justify-end'>
                        <Button variant='contained' type='submit'>Save</Button>
                    </Box>
                </Box>
            </Paper>
        </LocalizationProvider>
    </React.Fragment>
};

export default Form;