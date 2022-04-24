import { Paper, Box, Grid, TextField, Autocomplete, Button, Table, TableHead, TableBody, TableRow, TableCell, FormControlLabel, Checkbox } from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import http from "../../utils/http";
import { OPEN_SNACKBAR } from '../../store/common';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Input = styled('input')({
    display: 'none',
});

const Import = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [file, setFile] = React.useState(null);
    const [form, setForm] = React.useState({});
    const [sectors, setSector] = React.useState([]);
    const [jobroles, setJobrole] = React.useState([]);
    const [batch, setBatch] = React.useState([]);
    const [errors, setErrors] = React.useState({});

    const getSector = React.useCallback(() => {
        http.get('/api/sector').then((res) => setSector(res.data));
    }, []);

    React.useEffect(() => {
        getSector();
    }, [getSector]);

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

    const onChnage = (event) => {
        if (event.currentTarget?.files?.length > 0) {
            setFile({ name: event.currentTarget.files[0].name, size: event.currentTarget.files[0].size });
        } else {
            setFile(null);
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        setErrors({});
        const f = new FormData(event.currentTarget);
        f.append('sector', form?.sector?._id);
        f.append('jobrole', form?.jobrole?._id);
        f.append('batch', form?.batch?._id);
        f.append('autogenerate', form?.autogenerate);
        http.post('/api/candidate/import', f, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: event => {
                let percentCompleted = Math.round((100 * event.loaded) / event.total)
                console.log('completed: ', percentCompleted)
            }
        }).then((res) => {
            dispatch(OPEN_SNACKBAR({ message: 'Candidate uploaded successfully!' }));
            navigate('/candidate');
            // setPreview(res.data?.data);
        }).catch((err) => {
            // console.log(err.response);
            setErrors(err.response?.data?.errors || {});
        });
    };

    return <React.Fragment>
        <Paper className='p-5'>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                <Grid container spacing={2} >
                    <Grid item md={4} xs={12}>
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
                    <Grid item md={4} xs={12}>
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
                    <Grid item md={4} xs={12}>
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
                    <Grid item md={4} xs={12}>
                        <FormControlLabel control={<Checkbox onChange={(e, v) => setForm({ ...form, autogenerate: v })} checked={form?.autogenerate || false} />} label="Autogenerate Candidate ID" />
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <label htmlFor="contained-button-file">
                            <Input name='file' id="contained-button-file" onChange={onChnage} type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                            <Button color='success' variant="contained" component="span">
                                Upload
                            </Button>
                        </label>
                        {file && <Box>
                            {file?.name} : {(file?.size / 1024).toFixed(2)} KB
                        </Box>}
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Button variant='contained' type='submit' >Save</Button>
                    </Grid>
                </Grid>
                <Box className='mt-4 flex'>
                    <Link to="/candidate_sample.xlsx" target="_blank" className='mr-1 font-semibold' download>Click here</Link> to download sample candidate excel file format.
                </Box>
            </Box>
        </Paper>
        {Object.keys(errors).length > 0 && <Paper className='p-5 mt-5'>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Row Number</TableCell>
                        <TableCell>Errors</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(errors).map((row, index) => (
                        <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">{row}</TableCell>
                            <TableCell dangerouslySetInnerHTML={{ __html: Object.values(errors[row]).join('<br/>') }}></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>}
    </React.Fragment>
};

export default Import;
