import * as React from 'react';
import { Paper, Box, Typography, Grid, TextField, FormLabel, Button, Autocomplete } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import http from "../../utils/http";
import { OPEN_SNACKBAR } from '../../store/common';
import { SET_SECTOR } from '../../store/sector';

const Form = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sectors = useSelector(state => state.sector.sectors);
    const { id } = useParams();
    const [form, setForm] = React.useState({ name: "", code: "", level: "", duration: "", sector: "" });
    const [nos, setNos] = React.useState([]);

    const getSectors = React.useCallback(() => {
        http.get('/api/sector').then((res) => dispatch(SET_SECTOR(res.data)));
    }, [dispatch]);

    const getJobrole = React.useCallback(() => {
        if (id) {
            http.get(`/api/jobrole/${id}`).then((res) => {
                setForm({ _id: res.data?._id, name: res.data?.name, code: res.data?.code, level: res.data?.level, duration: res.data?.duration, sector: res.data?.sector });
                let nos = res.data.nos.map((v) => {
                    var elno = v.elements ? v.elements.length : 0;
                    return { ...v, elements_no: elno };
                });
                setNos(nos);
            });
        }
    }, [id]);

    React.useEffect(() => {
        getSectors();
        getJobrole();
    }, [getSectors, getJobrole]);

    const addNos = () => {
        var p = [...nos];
        p.push({ name: '', description: '', elements: [], elements_no: 0 });
        setNos(p);
    }

    const addElement = (index, size) => {
        var p = [...nos];
        var elements = [];
        if (size > 0) {
            for (let i = 0; i < size; i++) {
                elements.push({ name: `${p[index].name}-${i + 1}`, pc: 0 });
            }
        }
        p[index].elements = elements;
        setNos(p);
    }

    const handleChange = (e, v) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleNosChange = (e, k, i, k2, i2) => {
        let p = [...nos];
        if (k === "elements") {
            let el = [...p[i].elements];
            el[i2][k2] = e.target.value;
            p[i].elements = el;
        } else {
            p[i][k] = e.target.value;
        }
        if (k === 'name' && e.target.value === '') {
            addElement(i, 0);
            p[i]['elements_no'] = 0;
        }
        if (k === 'elements_no') {
            addElement(i, Number(e.target.value) || 0);
        }
        setNos(p);
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const f = new FormData(event.currentTarget);
        var data = {
            name: form.name,
            code: form.code,
            level: form.level,
            duration: form.duration,
            sector: f.get('sector'),
            nos: nos
        };

        if (form?._id) {
            http.put(`/api/jobrole/${form?._id}`, data).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'Jobrole Update Successfully.' }));
                setForm({ name: "", code: "", level: "", duration: "", sector: "" });
                setNos([]);
                navigate('/jobroles');
            })
        } else {
            http.post('/api/jobrole', data).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'New Jobrole Added.' }));
                setForm({ name: "", code: "", level: "", duration: "", sector: "" });
                setNos([]);
                navigate('/jobroles');
            })
        }
    };

    return <React.Fragment>
        <Paper className='p-5'>
            <Typography>{id ? 'Edit' : 'Add'} Jobrole</Typography>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                <Box className='mb-4'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                id="sector"
                                required
                                value={form.sector}
                                options={sectors}
                                className="w-full"
                                getOptionLabel={(option) => option ? option.name : ''}
                                renderInput={(params) => <TextField {...params} label="Sector" />}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.name}
                                    </Box>
                                )}
                                onChange={(e, v) => setForm({ ...form, sector: v })}
                            />
                            <input name="sector" value={form?.sector?._id} type="text" style={{ display: 'none' }} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="name"
                                name="name"
                                label="Name"
                                fullWidth
                                value={form?.name || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="code"
                                name="code"
                                label="Code"
                                fullWidth
                                value={form?.code || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="level"
                                name="level"
                                label="Level"
                                fullWidth
                                value={form?.level || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="duration"
                                name="duration"
                                label="Duration"
                                fullWidth
                                value={form?.duration || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Box className='mb-4'>
                    {nos?.length > 0 && nos?.map((n, idx) => (
                        <Box className='relative mt-4' key={idx} sx={{ p: 2 }} component="fieldset" style={{ borderColor: '#ccc', borderWidth: 1.5 }}>
                            <FormLabel component="legend">Nos {idx + 1}</FormLabel>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="nos[name][]"
                                        label="Nos ID"
                                        fullWidth

                                        value={n.name || ''}
                                        onChange={(e) => handleNosChange(e, 'name', idx)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="nos[description][]"
                                        label="Nos Description"
                                        fullWidth

                                        value={n.description || ''}
                                        onChange={(e) => handleNosChange(e, 'description', idx)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        type={'number'}
                                        name="nos[elements_no][]"
                                        label="No of elements"
                                        fullWidth

                                        value={n.elements_no || ''}
                                        disabled={n.name === ''}
                                        onChange={(e) => handleNosChange(e, 'elements_no', idx)}
                                    />
                                </Grid>
                                {n.elements_no > 0 && <Grid item xs={12} md={12}>
                                    {n.elements.map((el, ei) => <Grid key={ei} container spacing={2} className="justify-end">
                                        <Grid item xs={12} md={4} mb={2}>
                                            <TextField size='small'
                                                name={`nos[elements][${ei}][name]`}
                                                label="Element Name"
                                                fullWidth
                                                value={el.name || ''}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4} mb={2}>
                                            <TextField
                                                size='small'
                                                name={`nos[elements][${ei}][pc]`}
                                                label="PC"
                                                fullWidth
                                                value={el.pc || ''}
                                                onChange={(e) => handleNosChange(e, 'elements', idx, 'pc', ei)}
                                            />
                                        </Grid>
                                    </Grid>)}
                                </Grid>}
                            </Grid>
                        </Box>
                    ))}
                    <Box className='mb-4'>
                        <Button onClick={addNos}>Add Nos</Button>
                    </Box>
                </Box>

                <Box className='mb-4 flex justify-end'>
                    <Button variant='contained' type='submit' >Save</Button>
                </Box>
            </Box>
        </Paper>
    </React.Fragment>
};

export default Form;