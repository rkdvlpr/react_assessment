import * as React from 'react';
import { useParams } from 'react-router-dom';
import http from "../../utils/http";
import { OPEN_SNACKBAR } from '../../store/common';
import { Card, CardContent, Grid, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

const GenerateForm = () => {
    const { id, set_id } = useParams();
    const [strategy, setStrategy] = React.useState({});
    const [sets, setSets] = React.useState({});
    const getStrategy = React.useCallback(() => {
        if (id && set_id) {
            http.get(`/api/strategy/sets/${id}/${set_id}`).then((res) => {
                setStrategy(res.data);
                var strgy = res.data.strategy;
                if (Object.keys(res.data.sets).length > 0) {
                    var sets_data = {};
                    for (const type in strgy) {
                        if (strgy[type].length > 0) {
                            sets_data[type] = res.data.sets.questions.filter((v) => v.type === type);
                        }
                    }
                    setSets(sets_data);
                }
            });
        }
    }, [id, set_id]);

    React.useEffect(() => {
        getStrategy();
    }, [getStrategy]);

    const getQueston = (data, language = "eng") => data.find((v) => v.lang === language);

    const getQuestonType = (type) => {
        if (type === "mcq") {
            return "Multiple Choice Question";
        } else if (type === "viva") {
            return "Viva Question";
        } else {
            return "Demo Question";
        }
    };

    return <React.Fragment>
        <Paper className='p-5'>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography><b>Strategy: </b>{strategy.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography><b>Set Name: </b>{strategy.sets?.name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography><b>Set Language: </b>{strategy.sets?.languages?.map(v => {
                        return (v.slug === 'eng') ? v.name : `${v.name} (${v.eng_name})`
                    })?.join(", ")}</Typography>
                </Grid>
            </Grid>
        </Paper>
        {Object.keys(sets).length > 0 && Object.keys(sets).map((type, si) => <Card key={si} className='mt-5'>
            <CardContent>
                <Typography>{getQuestonType(type)}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell component={'th'}>Sr. No.</TableCell>
                                    <TableCell component={'th'}>Nos</TableCell>
                                    <TableCell component={'th'}>Element</TableCell>
                                    <TableCell component={'th'}>PC</TableCell>
                                    <TableCell component={'th'}>Difficulty</TableCell>
                                    <TableCell component={'th'}>Question</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sets[type].map((q, qi) => <TableRow key={qi}>
                                    <TableCell>{qi + 1}</TableCell>
                                    <TableCell>{q.nos.name}</TableCell>
                                    <TableCell>{q.nos.elements.find(v => v._id === q.element).name}</TableCell>
                                    <TableCell>{q.pc}</TableCell>
                                    <TableCell>{q.difficulty_level.name}</TableCell>
                                    <TableCell>{getQueston(q.question).content}</TableCell>
                                </TableRow>)}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>)}
    </React.Fragment>
};

export default GenerateForm;