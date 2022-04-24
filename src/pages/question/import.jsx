import * as React from 'react';
import { Paper, Box, Button, Table, TableHead, TableBody, TableRow, TableCell, Grid, TextField, Autocomplete } from '@mui/material';
import { styled } from '@mui/material/styles';
import { OPEN_SNACKBAR } from '../../store/common';
import { SET_SECTOR } from '../../store/sector';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import http from "../../utils/http";
import { ValidatorForm } from 'react-material-ui-form-validator';
import AutocompleteValidator from '../../components/AutocompleteValidator';
import UploadValidator from '../../components/UploadValidator';

const Input = styled('input')({
    display: 'none',
});

const Import = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sectors = useSelector(state => state.sector.sectors);
    const [jobroles, setJobrole] = React.useState([]);
    const [file, setFile] = React.useState(null);
    const [errors, setErrors] = React.useState({});
    const [form, setForm] = React.useState({ sector: '', jobrole: '' });

    const getSectors = React.useCallback(() => {
        http.get('/api/sector').then((res) => dispatch(SET_SECTOR(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getSectors();
    }, [getSectors]);

    const handleChangeName = (v, name) => {
        if (name === 'sector') {
            setForm({ ...form, [name]: v, jobrole: '' });
            setJobrole([]);
            if (v?._id) {
                http.get(`/api/sector/jobrole/${v?._id}`).then((res) => setJobrole(res.data));
            }
        } else {
            setForm({ ...form, [name]: v });
        }
    };

    const onChnage = (event) => {
        if (event.currentTarget?.files?.length > 0) {
            setFile({ name: event.currentTarget.files[0].name, size: event.currentTarget.files[0].size });
        } else {
            setFile(null);
        }
    };

    const onSubmit = (event) => {
        console.log(event);
        // event.preventDefault();
        // setErrors({});
        // const f = new FormData(event.currentTarget);
        // http.post('/api/question/import', f, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     },
        //     onUploadProgress: event => {
        //         let percentCompleted = Math.round((100 * event.loaded) / event.total)
        //         console.log('completed: ', percentCompleted)
        //     }
        // }).then((res) => {
        //     dispatch(OPEN_SNACKBAR({ message: 'Question uploaded successfully!' }));
        //     navigate('/question');
        // }).catch((err) => {
        //     setErrors(err.response?.data?.errors || {});
        // });
    };

    return <React.Fragment>
        <Paper className='p-5'>
            <ValidatorForm onSubmit={onSubmit}>
                <Grid container spacing={2} className='mb-4'>
                    <Grid item xs={12} md={4} mb={3}>
                        <AutocompleteValidator
                            id="sector"
                            validators={['required']}
                            errorMessages={['Sector is required']}
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
                        <input name="sector" value={form?.sector?._id || ''} onChange={(e) => console.log('')} type="hidden" />
                    </Grid>
                    <Grid item xs={12} md={4} mb={3}>
                        <AutocompleteValidator
                            id="jobrole"
                            validators={['required']}
                            errorMessages={['Jobrole is required']}
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
                        <input name="jobrole" value={form?.jobrole?._id || ''} onChange={(e) => console.log('')} type="hidden" />
                    </Grid>
                    <Grid item md={4} xs={12} mb={3}>
                        {/* <UploadValidator className='flex justify-end' name='file' id="contained-button-file" onChange={onChnage} type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/> */}
                        <label htmlFor="contained-button-file" className='flex justify-end'>
                            <Input name='file' id="contained-button-file" onChange={onChnage} type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                            <Button color='success' variant="contained" component="span">
                                Upload
                            </Button>
                        </label>
                        {file && <Box>
                            {file?.name} : {(file?.size / 1024).toFixed(2)} KB
                        </Box>}
                    </Grid>
                    <Grid item md={4} xs={12} mb={3}>
                        <Button variant='contained' type='submit' >Save</Button>
                    </Grid>
                </Grid>
                <Box className='mt-4 flex'>
                    <Link to="/question_sample.xlsx" target="_blank" className='mr-1' download><a className='font-semibold'>Click here</a></Link> to download sample question excel file format.
                </Box>
            </ValidatorForm>
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