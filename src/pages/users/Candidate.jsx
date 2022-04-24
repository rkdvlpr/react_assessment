import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SET_CANDIDATE } from '../../store/users'
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";

const Candidate = () => {
    const dispatch = useDispatch();
    const items = useSelector(state => state.users.candidates);
    const [open, setOpen] = React.useState(false);
    // const [form, setForm] = React.useState({});

    const getCandidates = React.useCallback(() => {
        http.get('api/state').then((res) => dispatch(SET_CANDIDATE(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getCandidates()
    }, [getCandidates]);

    const tableHooks = (hooks) => {
        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "",
                Header: "Action",
                accessor: "_id",
                disableSortBy: true
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Description', accessor: 'code' }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Tooltip title="Add New Candidate">
                    <Button variant="contained" endIcon={<AddIcon />} onClick={handleClickOpen}>
                        Add New Candidate
                    </Button>
                </Tooltip>
            </React.Fragment>
        } />
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Subscribe</Button>
            </DialogActions>
        </Dialog>
    </React.Fragment>
}

export default Candidate;