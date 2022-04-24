import { Paper, Box, Button, Table, TableHead, TableBody, TableRow, TableCell, Grid, FormControlLabel, Checkbox } from '@mui/material';
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
    const [errors, setErrors] = React.useState({});

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
        http.post('/api/assessor/import', f, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: event => {
                let percentCompleted = Math.round((100 * event.loaded) / event.total)
                console.log('completed: ', percentCompleted)
            }
        }).then((res) => {
            dispatch(OPEN_SNACKBAR({ message: 'Assessor uploaded successfully!' }));
            navigate('/assessor');
        }).catch((err) => {
            setErrors(err.response?.data?.errors || {});
        });
    };

    return <React.Fragment>
        <Paper className='p-5'>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                <Grid container spacing={2} className='mb-4'>
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
                        <Box>
                            <FormControlLabel control={<Checkbox name='autogenerate' />} label="Autogenerate Assessor ID" />
                        </Box>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Button variant='contained' type='submit' >Save</Button>
                    </Grid>
                </Grid>
                <Box className='mt-4 flex'>
                    <Link to="/assessor_sample.xlsx" target="_blank" className='mr-1 font-semibold' download>Click here</Link> to download sample assessor excel file format.
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
