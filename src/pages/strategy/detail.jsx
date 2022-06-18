import * as React from 'react';
import { Paper, Grid, Typography, Table, TableBody, TableHead, TableRow, TableCell, Autocomplete, Box, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { red } from '@mui/material/colors';
import http from "../../utils/http";
import { SET_LANGUAGE } from '../../store/common';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const StrategyDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const languages = useSelector(state => state.common.language);
    const [item, setItem] = React.useState({});
    const [strategy, setStrategy] = React.useState({});

    const getStrategy = React.useCallback(() => {
        if (id) {
            http.get(`/api/strategy/${id}`).then((res) => {
                setItem(res.data)
                setStrategy(res.data.strategy);
            });
        }
    }, [id]);

    const getLanguage = React.useCallback(() => {
        http.get(`/api/language`).then((res) => dispatch(SET_LANGUAGE(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getLanguage();
        getStrategy();
    }, [getLanguage, getStrategy]);

    const nosQMarks = (type, index) => {
        if (strategy[type].length > 0) {
            var v = strategy[type][index];
            return v.questions.reduce((a, b) => Number(a) + Number(b), 0);
        }
        return '0';
    };

    const onPreview = (language = []) => {
        http.post(`/api/strategy/preview`, { language: language, id: id }).then((res) => {
            setStrategy(res.data);
        })
    };

    return <React.Fragment>
        <Paper className='p-5'>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4} mb={3}>
                    <p><b>Name</b>: {item?.name}</p>
                </Grid>
                <Grid item xs={12} md={4} mb={3}>
                    <p><b>Sector</b>: {item?.sector?.name}</p>
                </Grid>
                <Grid item xs={12} md={4} mb={3}>
                    <p><b>Jobrole</b>: {item?.jobrole?.name}</p>
                </Grid>
                <Grid item xs={12} md={12} mb={3}>
                    <p><b>Instruction</b>: {item?.instruction}</p>
                </Grid>
                <Grid item xs={12} md={4} mb={3}>
                    <p><b>Duration</b>: {item?.duration}</p>
                </Grid>
                <Grid item xs={12} md={4} mb={3}>
                    <p><b>Passing %</b>: {item?.pass_percentage}</p>
                </Grid>
                <Grid item xs={12} md={4} mb={3}>
                    <Autocomplete
                        id="language"
                        multiple
                        required
                        size="small"
                        options={languages}
                        className="w-full"
                        disableClearable
                        getOptionLabel={(option) => option ? option.name : ''}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        renderInput={(params) => <TextField {...params} label="Language" />}
                        renderOption={(props, option) => (
                            <Box component="li" {...props}>
                                {option.name}
                            </Box>
                        )}
                        onChange={(e, v, r) => onPreview(v)}
                    />
                </Grid>
            </Grid>
        </Paper>
        {Object.keys(strategy).length > 0 && <div>
            <Paper className='p-5 mt-2'>
                <Typography variant="h6">Mcq</Typography>
                {strategy.mcq.length > 0 &&
                    <Table sx={{ width: '100%' }} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell component={'th'}>NOS ID</TableCell>
                                <TableCell component={'th'}>Element</TableCell>
                                <TableCell component={'th'}>PC</TableCell>
                                <TableCell component={'th'}>Difficulty Level</TableCell>
                                <TableCell component={'th'}>Questions/Marks</TableCell>
                                <TableCell component={'th'}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {strategy.mcq.map((mcq, mcqi) =>
                                <TableRow key={mcqi}>
                                    <TableCell>{mcq.nos.name}</TableCell>
                                    <TableCell>{mcq.element.name}</TableCell>
                                    <TableCell>{mcq.pc}</TableCell>
                                    <TableCell>{mcq.difficulty_level.name}</TableCell>
                                    <TableCell>{mcq.questions.length}/{nosQMarks('mcq', mcqi)}</TableCell>
                                    <TableCell>
                                        {Object.keys(mcq.count).length > 0 && Object.keys(mcq.count).map((k, ki) =>
                                            <div key={ki}>{k} : {mcq.questions.length <= mcq.count[k] ? <CheckCircleIcon color='success' /> : <CancelIcon sx={{ color: red[500] }} />}</div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                }
            </Paper>

            <Paper className='p-5 mt-2'>
                <Typography variant="h6">Viva</Typography>
                <Grid container spacing={2}>

                </Grid>
            </Paper>

            <Paper className='p-5 mt-2'>
                <Typography variant="h6">Demo</Typography>
                <Grid container spacing={2}>

                </Grid>
            </Paper>
        </div>}
    </React.Fragment>;
};

export default StrategyDetail;