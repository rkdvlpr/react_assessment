import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Paper, Box, Typography, Grid, TextField, Button, Chip } from '@mui/material';
import http from "../../utils/http";
import { OPEN_SNACKBAR } from '../../store/common';
import HtmlEditor from '../../components/HtmlEditor';

const Form = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [form, setForm] = React.useState({ name: "", subject: "", from_mail: "", from_name: "", description: "", tags: "" });
    const [content, setContent] = React.useState("");

    const getMailTemplate = React.useCallback(() => {
        if (id) {
            http.get(`/api/mail-template/${id}`).then((res) => {
                setForm({ _id: res.data._id, name: res.data.name, subject: res.data.subject, from_mail: res.data.from_mail, from_name: res.data.from_name, description: res.data.description, tags: res.data.tags });
                setContent(res.data.content);
            });
        }
    }, [id]);

    React.useEffect(() => {
        getMailTemplate();
    }, [getMailTemplate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const onSubmit = (event) => {
        event.preventDefault();
        // const f = new FormData(event.currentTarget);
        // f.append("content", form?.content);

        if (form?._id) {
            let d = { subject: form.subject, description: form.description, content: content };
            if (form.from_mail) {
                d['from_mail'] = form.from_mail;
            }
            if (form.from_name) {
                d['from_name'] = form.from_name;
            }

            http.put(`/api/mail-template/${form?._id}`, d).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'Template Update Successfully.' }));
                navigate('/mail-template');
            });
        } else {
            let d = { ...form };
            d['content'] = content;
            http.post('/api/mail-template', d).then((res) => {
                dispatch(OPEN_SNACKBAR({ message: 'New Template Added.' }));
                navigate('/mail-template');
            });
        }
    };

    const copyTextToClipboard = async (text) => {
        if ('clipboard' in navigator) {
          return await navigator.clipboard.writeText(text);
        } else {
          return document.execCommand('copy', true, text);
        }
    };

    return <React.Fragment>
        <Paper className='p-5'>
            <Typography>{id ? 'Edit' : 'Add'} Mail Template</Typography>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                <Box className='mb-4'>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="name"
                                name="name"
                                label="Name"
                                fullWidth
                                required
                                value={form?.name || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="from_mail"
                                name="from_mail"
                                label="From Mail"
                                fullWidth
                                value={form?.from_mail || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                id="from_name"
                                name="from_name"
                                label="From Name"
                                fullWidth
                                value={form?.from_name || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                multiline
                                rows={2}
                                id="description"
                                name="description"
                                label="Description"
                                fullWidth
                                value={form?.description || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            {form?._id && <Typography>Tags <small>(click to copy tag)</small></Typography>}
                            {form?._id ? <Grid container spacing={2}>
                                {form.tags.length > 0 && form.tags.map((v, idx) => <Grid key={idx} item xs={3} md={2}>
                                    <Chip label={`{{${v}}}`} onClick={() => copyTextToClipboard(`{{${v}}}`)} />
                                </Grid>)}
                            </Grid> : <TextField
                                id="tags"
                                name="tags"
                                label="Dybamic Tags"
                                fullWidth
                                value={form?.tags || ''}
                                onChange={handleChange}
                            />}
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TextField
                                id="subject"
                                name="subject"
                                label="Subject"
                                fullWidth
                                required
                                value={form?.subject || ''}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography>Template Content</Typography>
                            <HtmlEditor value={content || ''} onChange={(v) => setContent(v)} />
                        </Grid>
                    </Grid>
                </Box>

                <Box className='mb-4 flex justify-end'>
                    <Button variant='contained' type='submit' >Save</Button>
                </Box>
            </Box>
        </Paper>
    </React.Fragment>
};

export default Form;
