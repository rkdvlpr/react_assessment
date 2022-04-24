import * as React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, TextField, FormControl, Autocomplete, Box, Button, Paper, Typography, InputLabel, Select, MenuItem } from "@mui/material";
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
    const [states, setState] = React.useState([]);
    const [cities, setCities] = React.useState([]);
    const [jobroles, setJobrole] = React.useState([]);
    const [form, setForm] = React.useState({ name: '', email: '', mobile: '', image: '', address: '', pincode: '', state: "", city: "", sectors: [], jobroles: [], bank: { ac_holder: "", account: "", type: "", name: "", branch: "", ifsc: "" }, pan_number: "", aadhar_number: "", aadhar_image: "", resume_file: "", experience_file: "", qualification_file: "", qualification: "", toa: false, toa_valid_from: "", toa_valid_till: "" });
    const [files, setFiles] = React.useState({});
    const { id } = useParams();

    const getAssessor = React.useCallback(() => {
        if (id) {
            http.get(`/api/assessor/${id}`).then((res) => {
                setForm({ ...res.data, image: '', aadhar_image: "", resume_file: "", experience_file: "", qualification_file: "" });
                setFiles({ image: res.data.image, aadhar_image: res.data.aadhar_image, resume_file: res.data.resume_file, experience_file: res.data.experience_file, qualification_file: res.data.qualification_file });
            });
        }
    }, [id]);

    const getStates = React.useCallback(() => {
        http.get('/api/state').then((res) => setState(res.data));
    }, []);

    const getSectors = React.useCallback(() => {
        http.get('/api/sector').then((res) => dispatch(SET_SECTOR(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getAssessor();
        getStates();
        getSectors();
    }, [getStates, getSectors, getAssessor, id]);

    const handleChange = (e, v) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAutocompleteChange = (v, name) => {
        if (name === "state") {
            setCities([]);
            setForm({ ...form, city: '' });
        }
        if (name === "state" && v) {
            http.get(`/api/state/${v._id}`).then((res) => setCities(res.data.cities));
        }
        if (name === 'sectors') {
            setForm({ ...form, jobroles: [] });
            setJobrole([]);
            if (v?.length > 0) {
                http.post(`/api/sector/jobrole`, { sectors: v?.map(v => v._id) }).then((res) => setJobrole(res.data));
            }
        }
        setForm({ ...form, [name]: v });
    };

    const onSelectFile = (e, name) => {
        if (!e.target.files || e.target.files.length === 0) {
            setForm({ ...form, [name]: '' });
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setForm({ ...form, [name]: e.target.files[0] })
    }

    const onSubmit = (event) => {
        event.preventDefault();
        const f = new FormData(event.currentTarget);
        f.append("toa", form?.toa);
        if (form?.toa) {
            f.append("toa_valid_from", form?.toa_valid_from);
            f.append("toa_valid_till", form?.toa_valid_till);
        }

        if (form?._id) {
            if (!form?.toa) {
                f.append("toa_valid_from", "");
                f.append("toa_valid_till", "");
            }
            http.put(`/api/assessor/${form?._id}`, f).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'Assessor Update Successfully.' }));
                navigate('/assessor');
            })
        } else {
            http.post('/api/assessor', f).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'New Assessor Added.' }));
                navigate('/assessor');
            })
        }
    };

    return <React.Fragment>
        <LocalizationProvider dateAdapter={DateAdapter}>
            <Paper className='p-5'>
                <Typography>{id ? 'Edit' : 'Add'} Assessor</Typography>
                <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                    <Box className='mb-4'>
                        <Grid className="py-2" container spacing={{ xs: 2, md: 3 }}>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="name"
                                    label="Name"
                                    name="name"
                                    value={form?.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="email"
                                    label="Email"
                                    name="email"
                                    value={form?.email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="mobile"
                                    label="Mobile No."
                                    name="mobile"
                                    value={form?.mobile}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="address"
                                    label="Address"
                                    name="address"
                                    value={form?.address}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="pincode"
                                    label="Pincode"
                                    name="pincode"
                                    value={form?.pincode}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <Autocomplete
                                    id="state"
                                    required
                                    value={form.state || ''}
                                    options={states}
                                    className="w-full"
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    renderInput={(params) => <TextField {...params} label="State" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name} ({option.code})
                                        </Box>
                                    )}
                                    onChange={(e, v) => handleAutocompleteChange(v, 'state')}
                                />
                                <input name="state" value={form?.state?._id || ''} onChange={(e) => console.log('')} type="text" style={{ display: 'none' }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <Autocomplete
                                    id="city"
                                    required
                                    value={form.city || ''}
                                    options={cities}
                                    className="w-full"
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    renderInput={(params) => <TextField {...params} label="City" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    onChange={(e, v) => handleAutocompleteChange(v, 'city')}
                                />
                                <input name="city" value={form?.city?._id || ''} onChange={(e) => console.log('')} type="text" style={{ display: 'none' }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <Autocomplete
                                    id="sector"
                                    multiple
                                    required
                                    value={form?.sectors}
                                    options={sectors}
                                    className="w-full"
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    renderInput={(params) => <TextField {...params} label="Sector" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    onChange={(e, v) => handleAutocompleteChange(v, 'sectors')}
                                />
                                <input name="sectors" value={form?.sectors?.map(v => v._id)} onChange={(e) => console.log('')} type="text" style={{ display: 'none' }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <Autocomplete
                                    id="jobrole"
                                    multiple
                                    required
                                    value={form?.jobroles}
                                    options={jobroles}
                                    className="w-full"
                                    getOptionLabel={(option) => option ? option.name : ''}
                                    renderInput={(params) => <TextField {...params} label="Jobrole" />}
                                    renderOption={(props, option) => (
                                        <Box component="li" {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    onChange={(e, v) => setForm({ ...form, jobroles: v })}
                                />
                                <input name="jobroles" value={form?.jobroles?.map(v => v._id)} onChange={(e) => console.log('')} type="text" style={{ display: 'none' }} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="ac_holder_name"
                                    label="A/C Holder Name"
                                    name="bank[ac_holder]"
                                    value={form?.bank?.ac_holder}
                                    onChange={(e, v) => setForm({ ...form, bank: { ...form.bank, ac_holder: e.target.value } })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="ac_account"
                                    label="A/c Number"
                                    name="bank[account]"
                                    value={form?.bank?.account}
                                    onChange={(e, v) => setForm({ ...form, bank: { ...form.bank, account: e.target.value } })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="ac_type"
                                    label="A/c Type"
                                    name="bank[type]"
                                    value={form?.bank?.type}
                                    onChange={(e, v) => setForm({ ...form, bank: { ...form.bank, type: e.target.value } })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="bank_name"
                                    label="Bank Name"
                                    name="bank[name]"
                                    value={form?.bank?.name}
                                    onChange={(e, v) => setForm({ ...form, bank: { ...form.bank, name: e.target.value } })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="bank_branch"
                                    label="Bank Branch"
                                    name="bank[branch]"
                                    value={form?.bank?.branch}
                                    onChange={(e, v) => setForm({ ...form, bank: { ...form.bank, branch: e.target.value } })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="bank_ifsc"
                                    label="Bank ifsc"
                                    name="bank[ifsc]"
                                    value={form?.bank?.ifsc}
                                    onChange={(e, v) => setForm({ ...form, bank: { ...form.bank, ifsc: e.target.value } })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="pan_number"
                                    label="PAN Number"
                                    name="pan_number"
                                    value={form?.pan_number}
                                    onChange={(e, v) => setForm({ ...form, pan_number: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    required
                                    id="aadhar_number"
                                    label="Aadhar Number"
                                    name="aadhar_number"
                                    value={form?.aadhar_number}
                                    onChange={(e, v) => setForm({ ...form, aadhar_number: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <FormControl fullWidth required>
                                    <InputLabel id="toa-select-helper-label">TOA Certification</InputLabel>
                                    <Select
                                        labelId="toa-select-helper-label"
                                        id="toa-select-helper-label"
                                        label="TOA Certification"
                                        value={form?.toa}
                                        onChange={(e, v) => setForm({ ...form, toa: e.target.value, toa_valid_from: '', toa_valid_till: '' })}
                                    >
                                        <MenuItem value={false}>No</MenuItem>
                                        <MenuItem value={true}>Yes</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {form?.toa && <>
                                <Grid item xs={12} sm={6} md={6} mb={3}>
                                    <FormControl fullWidth>
                                        <DatePicker
                                            id="toa_valid_from"
                                            name="toa_valid_from"
                                            label="TOA Valid From"
                                            value={form?.toa_valid_from || ''}
                                            onChange={(e) => setForm({ ...form, toa_valid_from: e })}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} mb={3}>
                                    <FormControl fullWidth>
                                        <DatePicker
                                            id="toa_valid_till"
                                            name="toa_valid_till"
                                            label="TOA Valid Till"
                                            value={form?.toa_valid_till || ''}
                                            onChange={(e) => setForm({ ...form, toa_valid_till: e })}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </FormControl>
                                </Grid>
                            </>}
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <Box className="flex flex-col justify-center items-center border p-2">
                                    <img className="w-32 h-32" alt="profile" src={form.image ? URL.createObjectURL(form.image) : (files?.image ? files?.image : '/profile.png')} />
                                    <FormControl>
                                        <label htmlFor="icon-button-file" className="">
                                            <input name="image" onChange={(e) => onSelectFile(e, 'image')} accept="image/*" id="icon-button-file" type="file" style={{ display: 'none' }} />
                                            <Button variant="contained" component="span">Browse Profile Image</Button>
                                        </label>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <Box className="flex flex-col justify-center items-center border p-2">
                                    <img className="w-56 h-32" alt="profile" src={form?.aadhar_image ? URL.createObjectURL(form.aadhar_image) : (files?.aadhar_image ? files?.aadhar_image : '/id_card.png')} />
                                    <FormControl>
                                        <label htmlFor="icon-button-file-aadhar_image" className="">
                                            <input name="aadhar_image" onChange={(e) => onSelectFile(e, 'aadhar_image')} accept="image/*" id="icon-button-file-aadhar_image" type="file" style={{ display: 'none' }} />
                                            <Button variant="contained" component="span">Browse Aadhar Image</Button>
                                        </label>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <Box className="flex flex-col justify-center items-center border p-2">
                                    <FormControl>
                                        <label htmlFor="icon-button-file-resume_file" className="">
                                            <input name="resume_file" onChange={(e) => onSelectFile(e, 'resume_file')} accept=".pdf,.doc,.docx" id="icon-button-file-resume_file" type="file" style={{ display: 'none' }} />
                                            <Button variant="contained" component="span">Browse Resume</Button>
                                        </label>
                                    </FormControl>
                                    {form?.resume_file && <Box>
                                        {form?.resume_file?.name} : {(form?.resume_file?.size / 1024).toFixed(2)} KB
                                    </Box>}
                                    {files?.resume_file && <Box>
                                        <a className="text-blue-800" href={files?.resume_file} target="__blank">View File</a>
                                    </Box>}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <Box className="flex flex-col justify-center items-center border p-2">
                                    <FormControl>
                                        <label htmlFor="icon-button-file-experience_file" className="">
                                            <input name="experience_file" onChange={(e) => onSelectFile(e, 'experience_file')} accept=".pdf,.doc,.docx" id="icon-button-file-experience_file" type="file" style={{ display: 'none' }} />
                                            <Button variant="contained" component="span">Browse experience letter</Button>
                                        </label>
                                    </FormControl>
                                    {form?.experience_file && <Box>
                                        {form?.experience_file?.name} : {(form?.experience_file?.size / 1024).toFixed(2)} KB
                                    </Box>}
                                    {files?.experience_file && <Box>
                                        <a className="text-blue-800" href={files?.experience_file} target="__blank">View File</a>
                                    </Box>}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <Box className="flex flex-col justify-center items-center border p-2">
                                    <FormControl>
                                        <label htmlFor="icon-button-file-qualification_file" className="">
                                            <input name="qualification_file" onChange={(e) => onSelectFile(e, 'qualification_file')} accept=".pdf,.doc,.docx" id="icon-button-file-qualification_file" type="file" style={{ display: 'none' }} />
                                            <Button variant="contained" component="span">Browse Educational Qualification Certificate</Button>
                                        </label>
                                    </FormControl>
                                    {form?.qualification_file && <Box>
                                        {form?.qualification_file?.name} : {(form?.qualification_file?.size / 1024).toFixed(2)} KB
                                    </Box>}
                                    {files?.qualification_file && <Box>
                                        <a className="text-blue-800" href={files?.qualification_file} target="__blank">View File</a>
                                    </Box>}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} mb={3}>
                                <TextField
                                    fullWidth
                                    id="qualification"
                                    label="Qualification"
                                    name="qualification"
                                    value={form?.qualification}
                                    onChange={(e, v) => setForm({ ...form, qualification: e.target.value })}
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