import * as React from "react";
import PropTypes from "prop-types";
import { Avatar, Grid, TextField, FormControl, Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton } from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import http from "../../utils/http";

const AssessorFormModel = (props) => {
    const [states, setState] = React.useState([]);
    const [cities, setCities] = React.useState([]);
    const [form, setForm] = React.useState({ name: '', email: '', mobile: '', image: '', address: '', pincode: '', state: "", city: "" });
    const { id, open, onClose, onSubmit } = props;

    const getStates = React.useCallback(() => {
        http.get('/api/state').then((res) => setState(res.data));
    }, []);

    const getAssessor = React.useCallback(() => {
        http.get(`/api/user/assessor/${id}`).then((res) => {
            setForm(res.data);
        });
    }, [id]);

    React.useEffect(() => {
        getStates();
        console.log(id);
        if (id) {
            getAssessor();
        }
    }, [getStates, getAssessor, id]);

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
        setForm({ ...form, [name]: v });
    };

    const onSelectFile = e => {
        if (!e.target.files || e.target.files.length === 0) {
            setForm({ ...form, image: '' });
            return
        }

        // I've kept this example simple by using the first image instead of multiple
        setForm({ ...form, image: URL.createObjectURL(e.target.files[0]) })
    }

    const handleClose = (e) => {
        onClose(e);
        let f = {...form};
        for (const key in f) {
            if (Object.hasOwnProperty.call(f, key)) {
                f[key] = '';
            }
        }
        setForm(f);
    };

    return (
        <Dialog open={open} scroll={'paper'} fullWidth={true} maxWidth={'md'}>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                <DialogTitle>{id ? 'Edit' : 'Add New'} Assessor</DialogTitle>
                <DialogContent>
                    <Grid className="py-2" container spacing={{ xs: 2, md: 3 }}>
                        <Grid item xs={12} sm={6} md={6}>
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
                        <Grid item xs={12} sm={6} md={6}>
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
                        <Grid item xs={12} sm={6} md={6}>
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
                        <Grid item xs={12} sm={6} md={6}>
                            <FormControl className="w-full">
                                <label htmlFor="icon-button-file" className="flex justify-between">
                                    <input name="image" onChange={onSelectFile} accept="image/*" id="icon-button-file" type="file" style={{ display: 'none' }} />
                                    <IconButton color="primary" aria-label="upload picture" component="span">
                                        <PhotoCamera />
                                    </IconButton>
                                    <Avatar alt="profile" src={form.image ? form.image : '/profile.png'} />
                                </label>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
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
                        <Grid item xs={12} sm={6} md={6}>
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
                        <Grid item xs={12} sm={6} md={6}>
                            <Autocomplete
                                id="state"
                                name="state"
                                required
                                value={form.state}
                                options={states}
                                className="w-full"
                                getOptionLabel={(option) => option ? option.name : ''}
                                renderInput={(params) => <TextField {...params} label="States" />}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.name} ({option.code})
                                    </Box>
                                )}
                                onChange={(e, v) => handleAutocompleteChange(v, 'state')}
                            />
                            <input name="state" value={form?.state?._id} type="text" style={{ display: 'none' }} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6}>
                            <Autocomplete
                                id="city"
                                name="city"
                                required
                                value={form.city}
                                options={cities}
                                className="w-full"
                                getOptionLabel={(option) => option ? option.name : ''}
                                renderInput={(params) => <TextField {...params} label="Citys" />}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.name}
                                    </Box>
                                )}
                                onChange={(e, v) => handleAutocompleteChange(v, 'city')}
                            />
                            <input name="city" value={form?.city?._id} type="text" style={{ display: 'none' }} />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type='button' onClick={handleClose}>Cancel</Button>
                    <Button type='submit'>Save</Button>
                </DialogActions>
            </Box>
        </Dialog>
    )
};

AssessorFormModel.prototype = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    id: PropTypes.string
};

export default AssessorFormModel;