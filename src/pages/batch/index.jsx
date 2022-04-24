import * as React from 'react';
import { Tooltip, Button, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TableComponent from '../../components/TableComponent';
import moment from "moment";
import http from "../../utils/http";
import { SET_BATCH } from '../../store/sector';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Batch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(state => state.sector.batches);
    const [open, setOpen] = React.useState(false);
    const [view, setView] = React.useState({});

    const getBatch = React.useCallback(() => {
        http.get('/api/batch').then((res) => dispatch(SET_BATCH(res.data)));
        // dispatch(SET_BATCH([{ sector: { name: 'Media' }, jobrole: { name: 'Media Sector' }, batch_id: 'BTC001', name: "BATCH 001", batch_type: 'PMKVY', project_category: 'general', start_date: '', end_date: '', audit_date: '', center_address: 'address', state: { name: 'Delhi' }, city: { name: 'New Delhi' }, assessing_body: '', poc_name: '', poc_number: '' }]));
    }, [dispatch]);

    React.useEffect(() => {
        getBatch();
    }, [getBatch]);

    const tableHooks = (hooks) => {
        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "",
                Header: "Action",
                accessor: "_id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<Box>
                        <IconButton onClick={() => navigate(`/batch/${row.original?._id}/edit`)} aria-label="edit" color="primary">
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleClickOpen(row.original)} aria-label="view" color="info">
                            <VisibilityIcon />
                        </IconButton>
                    </Box>
                    )
                }
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        { Header: 'Batch ID', accessor: 'batch_id' },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Sector', accessor: 'sector.name' },
        { Header: 'Jobrole', accessor: 'jobrole.name' },
        { Header: 'City', accessor: 'city.name' }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    const handleClickOpen = (data) => {
        setView(data);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setView({});
    };

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Box>
                    <Tooltip title="Add New Batch">
                        <Button variant="contained" endIcon={<AddIcon />} onClick={() => navigate('/batch/add')}>
                            <Hidden only={'xs'}>Add New Batch</Hidden>
                        </Button>
                    </Tooltip>
                </Box>
                <Box ml={2}>
                    <Tooltip title="Import Batch">
                        <Button variant="contained" endIcon={<FileUploadIcon />} onClick={() => navigate('/batch/import')}>
                            <Hidden only={'xs'}>Import Batch</Hidden>
                        </Button>
                    </Tooltip>
                </Box>
            </React.Fragment>
        } />
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'md'}>
            <DialogTitle>Batch Detail</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <b>Batch Id :</b> {view?.batch_id}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>Name :</b> {view?.name}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>Batch Type :</b> {view?.batch_type?.name}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>Project Category :</b> {view?.batch_scheme?.name}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>Batch Start Date :</b> {moment(view?.start_date).format('DD-MMM-YYYY')}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>Batch End Date :</b> {moment(view?.end_date).format('DD-MMM-YYYY')}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>Sector :</b> {view?.sector?.name}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>Jobrole :</b> {view?.jobrole?.name}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>Assessment Date :</b> {moment(view?.assessment_date).format('DD-MMM-YYYY')}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>State :</b> {view?.state?.name}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>City :</b> {view?.city?.name}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>Center :</b> {view?.center_name}
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <b>Center Address :</b> {view?.center_address}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>POC Contact Name :</b> {view?.poc_name}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>POC Contact Number :</b> {view?.poc_number}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>Vtp Name :</b> {view?.vtp_name}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>Vtp Email :</b> {view?.vtp_email}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <b>No Of Candidates :</b> {view?.candidates}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>
}

export default Batch;