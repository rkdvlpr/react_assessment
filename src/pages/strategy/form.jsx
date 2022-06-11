import * as React from 'react';
import { Paper, Box, Typography, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Autocomplete, Accordion, AccordionDetails, AccordionSummary, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import http from "../../utils/http";
import { OPEN_SNACKBAR, SET_LANGUAGE } from '../../store/common';
import { SET_SECTOR } from '../../store/sector';
import DeleteIcon from '@mui/icons-material/Delete';

const Form = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sectors = useSelector(state => state.sector.sectors);
    const languages = useSelector(state => state.common.language);
    const [preview, setPreview] = React.useState({});
    const [preview_status, setPreviewStatus] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);
    const [nos, setNos] = React.useState([]);
    const [levels, setLevels] = React.useState([]);
    const { id } = useParams();
    const [form, setForm] = React.useState({
        sector: '',
        jobrole: '',
        name: '',
        instruction: '',
        duration: '',
        pass_percentage: "",
        strategy: { mcq: [], viva: [], demo: [] }
    });
    const [mcqForm, setMcqForm] = React.useState({ nos: '', element: '', pc: '', questions: '', level: '' });
    const [vivaForm, setVivaForm] = React.useState({ nos: '', element: '', pc: '', questions: '', level: '' });
    const [demoForm, setDemoForm] = React.useState({ nos: '', element: '', pc: '', questions: '', level: '' });
    const [jobroles, setJobrole] = React.useState([]);
    const [maxQuestion, setMaxQuestion] = React.useState({ mcq: 0, viva: 0, demo: 0 });

    const getSectors = React.useCallback(() => {
        http.get('/api/sector').then((res) => dispatch(SET_SECTOR(res.data)));
    }, [dispatch]);

    const getLanguage = React.useCallback(() => {
        http.get(`/api/language`).then((res) => dispatch(SET_LANGUAGE(res.data)));
    }, [dispatch]);

    const getStrategy = React.useCallback(() => {
        if (id) {
            http.get(`/api/strategy/${id}`).then((res) => setForm({ ...res.data, difficulty_level: res.data?.difficulty_level?._id }));
        }
    }, [id]);

    const getLevels = React.useCallback(() => {
        http.get(`/api/difficulty-level`).then((res) => setLevels(res.data));
    }, []);

    React.useEffect(() => {
        getSectors();
        getLevels();
        getStrategy();
        getLanguage();
    }, [getSectors, getLevels, getStrategy, getLanguage]);

    const getQuestionCount = (type, data) => {
        if (type === "mcq") {
            if (data.nos && data.element && data.pc && data.level) {
                http.post('/api/strategy/question-count', { type: "mcq", nos: data.nos._id, element: data.element._id, pc: data.pc, difficulty_level: data.level._id }).then((res) => setMaxQuestion({ ...maxQuestion, mcq: res.data.count }));
            }
        }
        if (type === "viva") {
            if (data.nos && data.element && data.pc && data.level) {
                http.post('/api/strategy/question-count', { type: "viva", nos: data.nos._id, element: data.element._id, pc: data.pc, difficulty_level: data.level._id }).then((res) => setMaxQuestion({ ...maxQuestion, viva: res.data.count }));
            }
        }
        if (type === "demo") {
            if (data.nos && data.element && data.pc && data.level) {
                http.post('/api/strategy/question-count', { type: "demo", nos: data.nos._id, element: data.element._id, pc: data.pc, difficulty_level: data.level._id }).then((res) => setMaxQuestion({ ...maxQuestion, demo: res.data.count }));
            }
        }
    }

    const handleChange = (e, v) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleChangeName = (v, name, reason = null) => {
        if (name === 'sector') {
            setForm({ ...form, [name]: v, jobrole: '', nos: '' });
            setJobrole([]);
            setNos([]);
            if (v?._id) {
                http.get(`/api/sector/jobrole/${v?._id}`).then((res) => setJobrole(res.data));
            }
        } else if (name === 'jobrole') {
            setNos([]);
            setForm({ ...form, [name]: v });
            if (v?._id) {
                http.get(`/api/jobrole/nos/${v?._id}`).then((res) => setNos(res.data));
            }
        }
    };

    const handlePanelChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const addStartegy = (type) => {
        if (type === 'mcq') {
            let strategy = { ...form.strategy };
            strategy[type].push({ nos: mcqForm.nos, element: mcqForm.element, pc: mcqForm.pc, questions: [...Array(mcqForm.questions).fill(0)], difficulty_level: mcqForm.level });
            setMcqForm({ nos: '', element: '', pc: '', level: '', questions: '' });
            setForm({ ...form, strategy: strategy });
        }
        if (type === 'viva') {
            let strategy = { ...form.strategy };
            strategy[type].push({ nos: vivaForm.nos, element: vivaForm.element, pc: vivaForm.pc, questions: [...Array(vivaForm.questions).fill(0)], difficulty_level: vivaForm.level });
            setVivaForm({ nos: '', element: '', pc: '', level: '', questions: '' });
            setForm({ ...form, strategy: strategy });
        }
        if (type === 'demo') {
            let strategy = { ...form.strategy };
            strategy[type].push({ nos: demoForm.nos, element: demoForm.element, pc: demoForm.pc, questions: [...Array(demoForm.questions).fill(0)], difficulty_level: demoForm.level });
            setDemoForm({ nos: '', element: '', pc: '', level: '', questions: '' });
            setForm({ ...form, strategy: strategy });
        }
    };

    const getSelectedNos = (type, id) => {
        if (type === "mcq") {
            return form.strategy[type].map(v => v.nos._id).includes(id);
        }
        if (type === "viva") {
            return form.strategy[type].map(v => v.nos._id).includes(id);
        }
        if (type === "demo") {
            return form.strategy[type].map(v => v.nos._id).includes(id);
        }
        return false;
    };

    const questionCounts = (type) => {
        if (form.strategy[type].length > 0) {
            return form.strategy[type].map(v => v.questions.length).reduce((a, b) => a + b, 0);
        }
        return '0';
    };

    const totalMarks = (type) => {
        if (form.strategy[type].length > 0) {
            return form.strategy[type].map(v => {
                if (v.questions.filter(v => v).length > 0) {
                    return v.questions.reduce((a, b) => Number(a) + Number(b), 0);
                }
                return 0;
            }).reduce((a, b) => Number(a) + Number(b), 0);
        }
        return '0';
    };

    const nosQMarks = (type, index) => {
        if (form.strategy[type].length > 0) {
            var v = form.strategy[type][index];
            return v.questions.reduce((a, b) => Number(a) + Number(b), 0);
        }
        return '0';
    };

    const removeStrategy = (type, index) => {
        let strategy = { ...form.strategy };
        if (type === "mcq") {
            strategy[type].splice(index, 1);
        }
        if (type === "viva") {
            strategy[type].splice(index, 1);
        }
        if (type === "demo") {
            strategy[type].splice(index, 1);
        }

        setForm({ ...form, strategy: strategy });
    };

    const changeNosPcLevel = (type, key, value) => {
        var data = {};
        if (type === "mcq") {
            data = { ...mcqForm, [key]: value };
            setMcqForm(data);
        }
        if (type === "viva") {
            data = { ...vivaForm, [key]: value };
            setVivaForm(data);
        }
        if (type === "demo") {
            data = { ...demoForm, [key]: value };
            setDemoForm(data);
        }
        getQuestionCount(type, data);
    };

    const changeQuestionMarks = (type, index, qi, value) => {
        let strategy = { ...form.strategy };
        strategy[type][index].questions[qi] = value;
        setForm({ ...form, strategy: strategy });
    };

    const onPreview = (language = []) => {
        let strategy = { ...form.strategy };
        http.post(`/api/strategy/preview`, { strategy: strategy, language: language }).then((res) => {
            setPreview(res.data);
        })
    };

    const onSubmit = (event) => {
        event.preventDefault();
        // const data = new FormData(event.currentTarget);
        var data = { ...form };
        data['sector'] = form?.sector?._id;
        data['jobrole'] = form?.jobrole?._id;

        var strategy = { ...data.strategy };
        for (let index = 0; index < Object.keys(strategy).length; index++) {
            const key = Object.keys(strategy)[index];
            for (let index1 = 0; index1 < strategy[key].length; index1++) {
                strategy[key][index1] = { nos: strategy[key][index1].nos._id, element: strategy[key][index1].element._id, pc: strategy[key][index1].pc, difficulty_level: strategy[key][index1].difficulty_level._id, questions: strategy[key][index1].questions };
            }
        }
        data['strategy'] = strategy;

        console.log(data);

        if (form?._id) {
            http.put(`/api/strategy/${form?._id}`, data).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'Strategy Update Successfully.' }));
                navigate('/strategy');
            })
        } else {
            http.post('/api/strategy', data).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'New Strategy Added.' }));
                navigate('/strategy');
            })
        }
    };

    const handleClose = (status = false) => {
        setPreviewStatus(status);
        setPreview({});
    };

    const enablePreview = () => {
        var strategy = { ...form.strategy };
        let status = true;
        for (let index = 0; index < Object.keys(strategy).length; index++) {
            const key = Object.keys(strategy)[index];
            if (strategy[key].length > 0) {
                status = false;
            }
        }
        return status;
    };

    return <React.Fragment>
        <Paper className='p-5'>
            <Typography>{id ? 'Edit' : 'Add'} Strategy</Typography>
            <Box className='mt-5' component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                <Box className='mb-4'>
                    <Grid container spacing={2}>
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
                            <TextField
                                id="name"
                                name="name"
                                label="Strategy Name"
                                fullWidth
                                value={form?.name || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} mb={3}>
                            <TextField
                                id={`instruction`}
                                name={`instruction`}
                                label={`Strategy Instruction`}
                                fullWidth
                                multiline
                                rows={4}
                                value={form?.instruction}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} mb={3}>
                            <TextField
                                id="duration"
                                name="duration"
                                label="Duration"
                                fullWidth
                                value={form?.duration || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} mb={3}>
                            <TextField
                                id="pass_percentage"
                                name="pass_percentage"
                                label="Passing percentage"
                                fullWidth
                                value={form?.pass_percentage || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} mb={3}>
                            <Accordion expanded={expanded === 'mcq'} onChange={handlePanelChange('mcq')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="mcq-content"
                                    id="mcq-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        Multiple Choice Questions
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>Total Question:{questionCounts('mcq')}, Total Marks:{totalMarks("mcq")}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="mcq_nos" style={{ fontSize: 12 }}>NOS ID</InputLabel>
                                                <Select
                                                    labelId="mcq_nos"
                                                    id="mcq_nos"
                                                    value={mcqForm?.nos}
                                                    onChange={(e) => changeNosPcLevel("mcq", "nos", e.target.value)}
                                                    label="NOS ID"
                                                    style={{ height: 40 }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {nos.length > 0 && nos.map((v, idx) => <MenuItem key={idx} disabled={getSelectedNos('mcq', v._id)} value={v}>{v.name}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <Autocomplete
                                                id="mcq_element"
                                                required
                                                size='small'
                                                value={mcqForm.element}
                                                options={mcqForm?.nos?.elements || []}
                                                className="w-full"
                                                getOptionLabel={(option) => option ? option.name : ''}
                                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                                renderInput={(params) => <TextField {...params} label="Elements" />}
                                                renderOption={(props, option) => (
                                                    <Box component="li" {...props}>
                                                        {option.name}
                                                    </Box>
                                                )}
                                                onChange={(e, v) => changeNosPcLevel("mcq", "element", v || '')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="mcq_pc" style={{ fontSize: 12 }}>PC</InputLabel>
                                                <Select
                                                    labelId="mcq_pc"
                                                    id="mcq_pc"
                                                    value={mcqForm?.pc}
                                                    onChange={(e) => changeNosPcLevel("mcq", "pc", e.target.value)}
                                                    label="PC"
                                                    style={{ height: 40 }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {(mcqForm.element !== '' && Object.keys(mcqForm.element).length > 0) && [...Array(mcqForm?.element?.pc)].map((v, idx) => <MenuItem key={idx} value={idx + 1}>{idx + 1}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="mcq_difficulty_level" style={{ fontSize: 12 }}>Difficulty Level</InputLabel>
                                                <Select
                                                    labelId="mcq_difficulty_level"
                                                    id="mcq_difficulty_level"
                                                    value={mcqForm?.level}
                                                    onChange={(e) => changeNosPcLevel("mcq", "level", e.target.value)}
                                                    label="Difficulty Level"
                                                    style={{ height: 40 }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {levels.map((v, idx) => <MenuItem key={idx} value={v}>{v.name}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="mcq_question" style={{ fontSize: 12 }}>No Of Questions</InputLabel>
                                                <Select
                                                    labelId="mcq_question"
                                                    id="mcq_question"
                                                    value={mcqForm?.questions}
                                                    onChange={(e) => setMcqForm({ ...mcqForm, questions: e.target.value })}
                                                    label="No Of Questions"
                                                    style={{ height: 40 }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {[...Array(maxQuestion.mcq)].map((v, idx) => <MenuItem key={idx} value={idx + 1}>{idx + 1}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <Box className='mb-4 flex justify-end'>
                                                <Button onClick={() => addStartegy('mcq')} variant='contained' disabled={mcqForm.nos === '' || mcqForm.pc === '' || mcqForm.level === '' || mcqForm.questions === ''} type='button' size="small">Add</Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    {form?.strategy?.mcq?.length > 0 && <Table sx={{ minWidth: '100%' }} size="small" aria-label="mcq table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>NOS</TableCell>
                                                <TableCell>Element</TableCell>
                                                <TableCell>PC</TableCell>
                                                <TableCell>Score/Questions</TableCell>
                                                <TableCell>Marks</TableCell>
                                                <TableCell>Difficulty Level</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {form?.strategy?.mcq.map((row, ri) => (
                                                <TableRow
                                                    key={ri}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.nos.name}
                                                    </TableCell>
                                                    <TableCell>{row.element.name}</TableCell>
                                                    <TableCell>{row.pc}</TableCell>
                                                    <TableCell>
                                                        {row.questions.length > 0 && row.questions.map((q, qi) => <input key={qi} value={q} onChange={(e) => changeQuestionMarks('mcq', ri, qi, e.target.value)} style={{ border: '1px solid #ccc', margin: '2px', width: 40 }} />)}
                                                    </TableCell>
                                                    <TableCell>{nosQMarks('mcq', ri)}</TableCell>
                                                    <TableCell>{row.difficulty_level.name}</TableCell>
                                                    <TableCell>
                                                        <IconButton color='error' aria-label="delete" onClick={() => removeStrategy("mcq", ri)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>))}
                                        </TableBody>
                                    </Table>}
                                </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'viva'} onChange={handlePanelChange('viva')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="viva-content"
                                    id="viva-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        Viva Questions
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>Total Question:{questionCounts('viva')}, Total Marks:{totalMarks("viva")}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="viva_nos" style={{ fontSize: 12 }}>NOS ID</InputLabel>
                                                <Select
                                                    labelId="viva_nos"
                                                    id="viva_nos"
                                                    value={vivaForm?.nos}
                                                    onChange={(e) => changeNosPcLevel("viva", "nos", e.target.value)}
                                                    label="NOS ID"
                                                    style={{ height: 40 }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {nos.length > 0 && nos.map((v, idx) => <MenuItem key={idx} disabled={getSelectedNos('viva', v._id)} value={v}>{v.name}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <Autocomplete
                                                id="viva_element"
                                                required
                                                size='small'
                                                value={vivaForm.element}
                                                options={vivaForm?.nos?.elements || []}
                                                className="w-full"
                                                getOptionLabel={(option) => option ? option.name : ''}
                                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                                renderInput={(params) => <TextField {...params} label="Elements" />}
                                                renderOption={(props, option) => (
                                                    <Box component="li" {...props}>
                                                        {option.name}
                                                    </Box>
                                                )}
                                                onChange={(e, v) => changeNosPcLevel("viva", "element", v || '')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="viva_pc" style={{ fontSize: 12 }}>PC</InputLabel>
                                                <Select
                                                    labelId="viva_pc"
                                                    id="viva_pc"
                                                    value={vivaForm?.pc}
                                                    onChange={(e) => changeNosPcLevel("viva", "pc", e.target.value)}
                                                    label="PC"
                                                    style={{ height: 40 }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {(vivaForm.element !== '' && Object.keys(vivaForm.element).length > 0) && [...Array(vivaForm?.element?.pc)].map((v, idx) => <MenuItem key={idx} value={idx + 1}>{idx + 1}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="viva_difficulty_level" style={{ fontSize: 12 }}>Difficulty Level</InputLabel>
                                                <Select
                                                    labelId="viva_difficulty_level"
                                                    id="viva_difficulty_level"
                                                    value={vivaForm?.level}
                                                    onChange={(e) => changeNosPcLevel("viva", "level", e.target.value)}
                                                    label="Difficulty Level"
                                                    style={{ height: 40 }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {levels.map((v, idx) => <MenuItem key={idx} value={v}>{v.name}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="viva_question" style={{ fontSize: 12 }}>No Of Questions</InputLabel>
                                                <Select
                                                    labelId="viva_question"
                                                    id="viva_question"
                                                    value={vivaForm?.questions}
                                                    onChange={(e) => setVivaForm({ ...vivaForm, questions: e.target.value })}
                                                    label="No Of Questions"
                                                    style={{ height: 40 }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {[...Array(maxQuestion.viva)].map((v, idx) => <MenuItem key={idx} value={idx + 1}>{idx + 1}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <Box className='mb-4 flex justify-end'>
                                                <Button onClick={() => addStartegy('viva')} variant='contained' disabled={vivaForm.nos === '' || vivaForm.pc === '' || vivaForm.level === '' || vivaForm.questions === ''} type='button' size="small">Add</Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    {form?.strategy?.viva?.length > 0 && <Table sx={{ minWidth: '100%' }} size="small" aria-label="viva table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>NOS</TableCell>
                                                <TableCell>Element</TableCell>
                                                <TableCell>PC</TableCell>
                                                <TableCell>Score/Questions</TableCell>
                                                <TableCell>Marks</TableCell>
                                                <TableCell>Difficulty Level</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {form?.strategy?.viva.map((row, ri) => (
                                                <TableRow
                                                    key={ri}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.nos.name}
                                                    </TableCell>
                                                    <TableCell>{row.element.name}</TableCell>
                                                    <TableCell>{row.pc}</TableCell>
                                                    <TableCell>
                                                        {row.questions.length > 0 && row.questions.map((q, qi) => <input key={qi} value={q} onChange={(e) => changeQuestionMarks('viva', ri, qi, e.target.value)} style={{ border: '1px solid #ccc', margin: '2px', width: 40 }} />)}
                                                    </TableCell>
                                                    <TableCell>{nosQMarks('viva', ri)}</TableCell>
                                                    <TableCell>{row.difficulty_level.name}</TableCell>
                                                    <TableCell>
                                                        <IconButton color='error' aria-label="delete" onClick={() => removeStrategy("viva", ri)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>))}
                                        </TableBody>
                                    </Table>}
                                </AccordionDetails>
                            </Accordion>
                            <Accordion expanded={expanded === 'demo'} onChange={handlePanelChange('demo')}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="demo-content"
                                    id="demo-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        Demo Questions
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>Total Question:{questionCounts('demo')}, Total Marks:{totalMarks("demo")}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo_nos" style={{ fontSize: 12 }}>NOS ID</InputLabel>
                                                <Select
                                                    labelId="demo_nos"
                                                    id="demo_nos"
                                                    value={demoForm?.nos}
                                                    onChange={(e) => changeNosPcLevel("demo", "nos", e.target.value)}
                                                    label="NOS ID"
                                                    style={{ height: 40 }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {nos.length > 0 && nos.map((v, idx) => <MenuItem key={idx} disabled={getSelectedNos('demo', v._id)} value={v}>{v.name}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <Autocomplete
                                                id="demo_element"
                                                required
                                                size='small'
                                                value={demoForm.element}
                                                options={demoForm?.nos?.elements || []}
                                                className="w-full"
                                                getOptionLabel={(option) => option ? option.name : ''}
                                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                                renderInput={(params) => <TextField {...params} label="Elements" />}
                                                renderOption={(props, option) => (
                                                    <Box component="li" {...props}>
                                                        {option.name}
                                                    </Box>
                                                )}
                                                onChange={(e, v) => changeNosPcLevel("demo", "element", v || '')}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo_pc" style={{ fontSize: 12 }}>PC</InputLabel>
                                                <Select
                                                    labelId="demo_pc"
                                                    id="demo_pc"
                                                    value={demoForm?.pc}
                                                    onChange={(e) => changeNosPcLevel("demo", "pc", e.target.value)}
                                                    label="PC"
                                                    style={{ height: 40 }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {(demoForm.element !== '' && Object.keys(demoForm.element).length > 0) && [...Array(demoForm?.element?.pc)].map((v, idx) => <MenuItem key={idx} value={idx + 1}>{idx + 1}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo_difficulty_level" style={{ fontSize: 12 }}>Difficulty Level</InputLabel>
                                                <Select
                                                    labelId="demo_difficulty_level"
                                                    id="demo_difficulty_level"
                                                    value={demoForm?.level}
                                                    onChange={(e) => changeNosPcLevel("demo", "level", e.target.value)}
                                                    label="Difficulty Level"
                                                    style={{ height: 40 }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {levels.map((v, idx) => <MenuItem key={idx} value={v}>{v.name}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo_question" style={{ fontSize: 12 }}>No Of Questions</InputLabel>
                                                <Select
                                                    labelId="demo_question"
                                                    id="demo_question"
                                                    value={demoForm?.questions}
                                                    onChange={(e) => setDemoForm({ ...demoForm, questions: e.target.value })}
                                                    label="No Of Questions"
                                                    style={{ height: 40 }}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {[...Array(maxQuestion.demo)].map((v, idx) => <MenuItem key={idx} value={idx + 1}>{idx + 1}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={2} mb={3}>
                                            <Box className='mb-4 flex justify-end'>
                                                <Button onClick={() => addStartegy('demo')} variant='contained' disabled={demoForm.nos === '' || demoForm.pc === '' || demoForm.level === '' || demoForm.questions === ''} type='button' size="small">Add</Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    {form?.strategy?.demo?.length > 0 && <Table sx={{ minWidth: '100%' }} size="small" aria-label="demo table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>NOS</TableCell>
                                                <TableCell>Element</TableCell>
                                                <TableCell>PC</TableCell>
                                                <TableCell>Score/Questions</TableCell>
                                                <TableCell>Marks</TableCell>
                                                <TableCell>Difficulty Level</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {form?.strategy?.demo.map((row, ri) => (
                                                <TableRow
                                                    key={ri}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row">
                                                        {row.nos.name}
                                                    </TableCell>
                                                    <TableCell>{row.element.name}</TableCell>
                                                    <TableCell>{row.pc}</TableCell>
                                                    <TableCell>
                                                        {row.questions.length > 0 && row.questions.map((q, qi) => <input key={qi} value={q} onChange={(e) => changeQuestionMarks('demo', ri, qi, e.target.value)} style={{ border: '1px solid #ccc', margin: '2px', width: 40 }} />)}
                                                    </TableCell>
                                                    <TableCell>{nosQMarks('demo', ri)}</TableCell>
                                                    <TableCell>{row.difficulty_level.name}</TableCell>
                                                    <TableCell>
                                                        <IconButton color='error' aria-label="delete" onClick={() => removeStrategy("demo", ri)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>))}
                                        </TableBody>
                                    </Table>}
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    </Grid>
                </Box>
                <Box className='mb-4 flex justify-end'>
                    <Button variant='contained' color='secondary' type='button' onClick={() => onPreview()} style={{ marginRight: 2, color: '#fff' }}>Preview</Button>
                    <Button variant='contained' disabled={!preview_status} type='submit'>Save</Button>
                </Box>
            </Box>
        </Paper>
        <Dialog open={Object.keys(preview).length > 0} onClose={handleClose} fullWidth={true} maxWidth={'md'}>
            <DialogTitle>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4} mb={3}>
                        Question Availability
                    </Grid>
                    <Grid item xs={12} md={8} mb={3}>
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
            </DialogTitle>
            <DialogContent>
                {Object.keys(preview).length > 0 && Object.keys(preview).map((type, ti) =>
                    <div key={ti}>
                        <Typography>{type}</Typography>
                        <div className='mb-2' style={{ borderBottom: '1px solid #ccc' }}>
                            {preview[type].length > 0 && preview[type].map((v, i) =>
                                <Grid container spacing={2} key={i}>
                                    <Grid item xs={1} md={1} mb={2}>{i + 1}.</Grid>
                                    <Grid item xs={6} md={6} mb={2}>{v.nos.name}</Grid>
                                    <Grid item xs={5} md={5} mb={2}>
                                        {Object.keys(v.count).length > 0 && Object.keys(v.count).map((k, ki) =>
                                            <div key={ki}>{k} : {v.questions.length <= v.count[k] ? "Available" : "Not Available"}</div>
                                        )}
                                    </Grid>
                                </Grid>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button type='button' onClick={() => handleClose(false)}>Cancel</Button>
                <Button type='button' onClick={() => handleClose(true)}>Ok</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>;
};

export default Form;