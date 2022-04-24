import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { Tooltip, Button, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Grid, Table, TableBody, TableRow, TableCell, TableHead, Typography, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { SET_JOBROLE } from '../../store/sector';
import { useDispatch, useSelector } from 'react-redux';

const Jobrole = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const items = useSelector(state => state.sector.jobroles);
    const [open, setOpen] = React.useState(false);
    const [view, setView] = React.useState({});

    const getJobroles = React.useCallback(() => {
        http.get('/api/jobrole').then((res) => dispatch(SET_JOBROLE(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getJobroles();
    }, [getJobroles]);

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
                        <IconButton onClick={() => navigate(`/jobroles/${row?.original?._id}/edit`)} aria-label="edit" color="primary">
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
        { Header: 'Name', accessor: 'name' },
        { Header: 'Code', accessor: 'code' },
        { Header: 'Level', accessor: 'level' },
        { Header: 'Duration', accessor: 'duration' },
        { Header: 'Sector', accessor: 'sector.name' }
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
                <Tooltip title="Add New Jobrole">
                    <Button variant="contained" endIcon={<AddIcon />} onClick={() => navigate('/jobroles/add')}>
                        <Hidden only={'xs'}>Add New Jobrole</Hidden>
                    </Button>
                </Tooltip>
            </React.Fragment>
        } />
        <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'md'}>
            <DialogTitle>Jobrole Detail</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Table aria-label="simple table">
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th">Name</TableCell>
                                    <TableCell>: {view?.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Code</TableCell>
                                    <TableCell>: {view?.code}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Level</TableCell>
                                    <TableCell>: {view?.level}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Duration</TableCell>
                                    <TableCell>: {view?.duration}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th">Sector</TableCell>
                                    <TableCell>: {view?.sector?.name}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant='h6'>Nos Details</Typography>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">Nos ID</TableCell>
                                    <TableCell component="th">Description</TableCell>
                                    <TableCell component="th">PC</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {view?.nos?.length > 0 && view?.nos?.map((nos, idx) => (
                                    <TableRow>
                                        <TableCell>{nos.name}</TableCell>
                                        <TableCell>{nos.description}</TableCell>
                                        <TableCell>{nos.pc}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>
}

export default Jobrole;