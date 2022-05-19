
import * as React from 'react';
import PropTypes from "prop-types";
import { Paper, Box, Typography, Grid, TextField, Button, Autocomplete, FormControl, Select, MenuItem, InputLabel, Tabs, Tab } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import http from "../../utils/http";
import { OPEN_SNACKBAR, SET_LANGUAGE } from '../../store/common';
import { SET_SECTOR } from '../../store/sector';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

TabPanel.propType = {
    children: PropTypes.element.isRequired,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Form = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sectors = useSelector(state => state.sector.sectors);
    const languages = useSelector(state => state.common.language);
    const { id } = useParams();
    const [form, setForm] = React.useState({
        sector: '',
        jobrole: '',
        type: 'mcq',
        nos: '',
        pc: '',
        difficulty_level: '',
        language: [],
        question: []
    });
    const [jobroles, setJobrole] = React.useState([]);
    const [nos, setNos] = React.useState([]);
    const [levels, setLevels] = React.useState([]);
    const [tabvalue, setTabValue] = React.useState(0);

    const getSectors = React.useCallback(() => {
        http.get('/api/sector').then((res) => dispatch(SET_SECTOR(res.data)));
    }, [dispatch]);

    const getLevels = React.useCallback(() => {
        http.get(`/api/difficulty-level`).then((res) => setLevels(res.data));
    }, [dispatch]);

    const getLanguage = React.useCallback(() => {
        http.get(`/api/language`).then((res) => dispatch(SET_LANGUAGE(res.data)));
    }, [dispatch]);

    const getQuestion = React.useCallback(() => {
        if (id) {
            http.get(`/api/question/${id}`).then((res) => setForm({ ...res.data, difficulty_level: res.data?.difficulty_level?._id }));
        }
    }, [id]);

    React.useEffect(() => {
        getSectors();
        getLevels();
        getLanguage();
        getQuestion();
    }, [getSectors, getLevels, getLanguage, getQuestion]);

    // const handleChange = (e, v) => {
    //     setForm({ ...form, [e.target.name]: e.target.value });
    // };

    const handleQuestionChange = (v, i, name) => {
        let f = { ...form };
        f.question[i][name] = v;
        setForm(f);
    };

    const handleQuestionOptionChange = (v, i, name, oi) => {
        let f = { ...form };
        f.question[i][name][oi]['content'] = v;
        setForm(f);
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
            setForm({ ...form, [name]: v, nos: '' });
            setNos([]);
            if (v?._id) {
                http.get(`/api/jobrole/nos/${v?._id}`).then((res) => setNos(res.data));
            }
        } else if (name === 'language') {
            let d = [...form.question];
            for (const q of v) {
                if (!d.some(obj => obj.lang === q.slug)) {
                    d.push({
                        lang: q.slug,
                        content: "",
                        image: "/upload.png",
                        description: "",
                        options: [{ image: "/upload.png", content: "" }, { image: "/upload.png", content: "" }, { image: "/upload.png", content: "" }, { image: "/upload.png", content: "" }]
                    });
                }
            }
            if (reason === 'removeOption') {
                let ex_q = [];
                for (const ex of d) {
                    if (v.some(obj => obj.slug === ex.lang)) {
                        ex_q.push(ex);
                    }
                }
                d = ex_q;
            }
            setForm({ ...form, [name]: v, question: d });
        }
    };

    const getLanguageTitle = (slug) => {
        let l = languages.length > 0 ? languages.find(x => x.slug === slug) : { name: "English" };
        if (slug === 'eng') {
            return "English";
        } else {
            return `${l.name}(${l.eng_name})`;
        }
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // var data = { ...form };
        data.set('sector', form?.sector?._id);
        data.set('jobrole', form?.jobrole?._id);
        data.set('nos', form?.nos?._id);
        data.set('language', form?.language?.map((v) => v._id));
        data.set('question', JSON.stringify(form.question));
        if (form?._id) {
            http.put(`/api/question/${form?._id}`, data).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'Question Update Successfully.' }));
                navigate('/question');
            })
        } else {
            http.post('/api/question', data).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'New Question Added.' }));
                navigate('/question');
            })
        }
    };

    return <React.Fragment>
        <Paper className='p-5'>
            <Typography>{id ? 'Edit' : 'Add'} Question</Typography>
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
                            <Autocomplete
                                id="nos"
                                required
                                value={form.nos}
                                options={nos}
                                className="w-full"
                                getOptionLabel={(option) => option ? option.name : ''}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                renderInput={(params) => <TextField {...params} label="Nos ID" />}
                                renderOption={(props, option) => (
                                    <Box component="li" {...props}>
                                        {option.name}
                                    </Box>
                                )}
                                onChange={(e, v) => setForm({ ...form, nos: v })}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} mb={3}>
                            <FormControl fullWidth>
                                <InputLabel id="pc">PC</InputLabel>
                                <Select
                                    labelId="pc"
                                    id="pc"
                                    name="pc"
                                    value={form?.pc}
                                    onChange={(e) => setForm({ ...form, pc: e.target.value })}
                                    label="PC"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {(form.nos !== '' && Object.keys(form.nos).length > 0) && [...Array(form?.nos?.pc)].map((v, idx) => <MenuItem key={idx} value={idx + 1}>{idx + 1}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4} mb={3}>
                            <FormControl fullWidth>
                                <InputLabel id="difficulty_level">Difficulty Level</InputLabel>
                                <Select
                                    labelId="difficulty_level"
                                    id="difficulty_level"
                                    name="difficulty_level"
                                    value={form?.difficulty_level}
                                    onChange={(e) => setForm({ ...form, difficulty_level: e.target.value })}
                                    label="Difficulty Level"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {levels.map((v, idx) => <MenuItem key={idx} value={v._id}>{v.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4} mb={3}>
                            <FormControl fullWidth>
                                <InputLabel id="type">Question type</InputLabel>
                                <Select
                                    labelId="type"
                                    id="type"
                                    name="type"
                                    value={form?.type}
                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                    label="Question type"
                                >
                                    <MenuItem value="mcq">MCQ</MenuItem>
                                    <MenuItem value="viva">VIVA</MenuItem>
                                    <MenuItem value="demo">DEMO</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} mb={3}>
                            <Autocomplete
                                id="language"
                                multiple
                                required
                                value={form?.language}
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
                                onChange={(e, v, r) => handleChangeName(v, 'language', r)}
                            />
                        </Grid>

                        {form?.question?.length > 0 && <Grid item xs={12} md={12} mb={3}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={tabvalue} onChange={(e, v) => setTabValue(v)} aria-label="basic tabs example" variant="scrollable" scrollButtons
                                    allowScrollButtonsMobile>
                                    {form.question.map((q, qi) => <Tab key={qi} label={`${getLanguageTitle(q.lang)} Question`} value={qi} {...a11yProps(qi)} />)}
                                </Tabs>
                            </Box>
                            {form.question.map((q, qi) => <TabPanel key={qi} value={tabvalue} index={qi}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12} mb={3}>
                                        <TextField
                                            id={`description-${q.lang}`}
                                            name={`question[${qi}][description]`}
                                            label={`${getLanguageTitle(q.lang)} Question Description`}
                                            fullWidth
                                            multiline
                                            rows={4}
                                            value={q?.description}
                                            onChange={(e) => handleQuestionChange(e.target.value, qi, 'description')}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={12} mb={3}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={9} mb={3}>
                                                <TextField
                                                    id={`question-${q.lang}`}
                                                    name={`question[${qi}][lang]`}
                                                    label={`${getLanguageTitle(q.lang)} Question`}
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    value={q?.content || ''}
                                                    onChange={(e) => handleQuestionChange(e.target.value, qi, 'content')}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3} mb={3}>
                                                <img src={q?.image || ''} style={{ height: 125 }} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {q.options.length > 0 && q.options.map((o, oi) => <Grid key={oi} item xs={12} md={12} mb={3}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={9} mb={3}>
                                                <TextField
                                                    id={`options-${q.lang}`}
                                                    name={`question[${qi}][options][${oi}][content]`}
                                                    label={`${getLanguageTitle(q.lang)} Option ${oi + 1}`}
                                                    fullWidth
                                                    multiline
                                                    rows={2}
                                                    value={o.content || ''}
                                                    onChange={(e) => handleQuestionOptionChange(e.target.value, qi, 'options', oi)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3} mb={3}>
                                                <img src={o?.image || ''} style={{ height: 79 }} />
                                            </Grid>
                                        </Grid>
                                    </Grid>)}
                                </Grid>
                            </TabPanel>)}
                        </Grid>}
                    </Grid>
                </Box>
                <Box className='mb-4 flex justify-end'>
                    <Button variant='contained' type='submit' >Save</Button>
                </Box>
            </Box>
        </Paper>
    </React.Fragment>;
};

export default Form;