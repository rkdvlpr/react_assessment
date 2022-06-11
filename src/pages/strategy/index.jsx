import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Button, IconButton, Box, Hidden, Dialog, DialogTitle, DialogActions, DialogContent, Grid, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { SET_STRATEGY } from '../../store/strategy';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { useNavigate } from 'react-router-dom';

const Strategy = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(state => state.strategy.items);
    const [sets, setSets] = React.useState({});
    const [generate_set, setGenerateSet] = React.useState('');

    const getStrategy = React.useCallback(() => {
        http.get('/api/strategy').then((res) => dispatch(SET_STRATEGY(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getStrategy()
    }, [getStrategy]);

    const tableHooks = (hooks) => {
        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "action",
                Header: "Action",
                accessor: "_id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<Box className='flex'>
                        <IconButton onClick={() => navigate(`/strategy/${row.original?._id}/edit`)} aria-label="edit" color="primary">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => navigate(`/strategy/${row.original?._id}/detail`)} aria-label="view" color="info">
                            <VisibilityIcon />
                        </IconButton>
                    </Box>)
                }
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Sector', accessor: 'sector.name' },
        { Header: 'Jobrole', accessor: 'jobrole.name' },
        {
            Header: 'Assessment Type', accessor: d => {
                var asstype = [];
                for (const strgy in d.strategy) {
                    if (d.strategy[strgy].length > 0) {
                        asstype.push(strgy);
                    }
                }
                return asstype.join(", ");
            }
        },
        { Header: 'Duration', accessor: 'duration' },
        { Header: 'Pass Marks', accessor: 'pass_percentage' },
        {
            Header: 'Assessment Sets', id: "sets", accessor: 'pass_percentage',
            Cell: ({ row }) => {
                return (<Button onClick={() => setSets(row.original)} aria-label="sets" color="primary">
                    {row.original?.sets?.length || '0'}
                </Button>)
            }
        }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    const closeSetDialog = () => {
        setSets({});
    };

    const submitGenerate = (id) => {
        setGenerateSet(id);
        http.post(`/api/strategy/generate-set/${id}`).then((res) => {
            setGenerateSet('');
            navigate(`/strategy/${id}/generate/${res.data.sets[res.data.sets.length - 1]._id}`);
        });
    };

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Box>
                    <Tooltip title="Add New Strategy">
                        <Button variant="contained" endIcon={<AddIcon />} onClick={() => navigate('/strategy/add')}>
                            <Hidden only={'xs'}>Add New Strategy</Hidden>
                        </Button>
                    </Tooltip>
                </Box>
            </React.Fragment>
        } />
        <Dialog
            fullWidth={true}
            maxWidth={'sm'}
            open={Object.keys(sets).length > 0}
            onClose={closeSetDialog}
        >
            <DialogTitle>Assessment Set Detail</DialogTitle>
            <DialogContent>
                {(Object.keys(sets).length > 0 && sets.sets.length > 0) && sets.sets.map((s, si) => <Grid container spacing={2} key={si} style={{ borderBottom: '1px solid #ccc' }}>
                    <Grid item xs={5} md={5}>{si + 1}.</Grid>
                    <Grid item xs={5} md={5}>{s.name}</Grid>
                    <Grid item xs={2} md={2}>
                        <IconButton onClick={() => navigate(`/strategy/${sets._id}/generate/${s._id}`)} aria-label="view" color="info">
                            <VisibilityIcon />
                        </IconButton>
                    </Grid>
                </Grid>)}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeSetDialog}>Cancel</Button>
                <Button color='success' onClick={() => {
                    closeSetDialog();
                    submitGenerate(sets._id)
                }}>Generate</Button>
            </DialogActions>
        </Dialog>
        <Dialog
            fullWidth={true}
            maxWidth={'xs'}
            open={generate_set !== ""}
        >
            <DialogTitle>Generating Sets...</DialogTitle>
            <DialogContent>
                <Box className='flex justify-center'>
                    <CircularProgress />
                </Box>
            </DialogContent>
        </Dialog>
    </React.Fragment>
}

export default Strategy;