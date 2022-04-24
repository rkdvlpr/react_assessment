import * as React from 'react';
import { Box, Tooltip, Button, Dialog, DialogActions, DialogContent, IconButton, DialogTitle, TextField, FormControl, FormLabel, FormControlLabel, RadioGroup, Radio, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { OPEN_SNACKBAR } from '../../store/common';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const CityList = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [state, setState] = React.useState({});
    const [items, setCity] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = React.useState({});

    const getCity = React.useCallback(() => {
        http.get(`/api/state/${id}`).then((res) => {
            setState({ _id: res.data._id, name: res.data.name, code: res.data.code });
            setCity(res.data.cities);
        });
    }, [id]);

    React.useEffect(() => {
        getCity();
    }, [getCity]);

    const tableHooks = (hooks) => {
        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "",
                Header: "Action",
                accessor: "_id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<IconButton onClick={() => handleClickOpen(row.original)} aria-label="edit" color="primary">
                        <EditIcon />
                    </IconButton>)
                }
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        { Header: 'Name', accessor: 'name' },
        {
            Header: 'District', accessor: 'isDistrict', Cell: ({ row }) => {
                return row.original?.isDistrict ? 'Yes' : 'No';
            }
        }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    const handleClickOpen = (data = {}) => {
        setForm(data);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setForm({});
    };

    const onSubmit = (event) => {
        event.preventDefault();
        const f = new FormData(event.currentTarget);
        var data = { state: id, name: f.get('name'), isDistrict: f.get('isDistrict') };
        if (form?._id) {
            http.put(`/api/city/${form?._id}`, data).then((res) => {
                getCity();
                dispatch(OPEN_SNACKBAR({ message: 'City Update Successfully.' }));
                handleClose();
            })
        } else {
            http.post('/api/city', data).then((res) => {
                getCity();
                dispatch(OPEN_SNACKBAR({ message: 'New City Added.' }));
                handleClose();
            })
        }
    };

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Tooltip title="Add City">
                    <Button variant="contained" endIcon={<AddIcon />} onClick={handleClickOpen}>
                        <Hidden only={'xs'}>Add City</Hidden>
                    </Button>
                </Tooltip>
            </React.Fragment>
        } />
        <Dialog open={open} fullWidth maxWidth={'sm'}>
            <Box component="form" onSubmit={onSubmit} noValidate autoComplete="off">
                <DialogTitle>{form?._id ? 'Edit' : 'Add New'} City {form?._id ? 'Of' : 'For'} {state?.name}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="City Name"
                        fullWidth
                        value={form?.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                        variant="standard"
                    />
                    <FormControl fullWidth style={{ marginTop: 10 }}>
                        <FormLabel id="isDistrict">isDistrict</FormLabel>
                        <RadioGroup
                            aria-labelledby="isDistrict"
                            name="isDistrict"
                            value={form?.isDistrict}
                            onChange={(event) => setForm({ ...form, isDistrict: event.target.value })}
                        >
                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                            <FormControlLabel value={false} control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button type='button' onClick={handleClose}>Cancel</Button>
                    <Button type='submit'>Save</Button>
                </DialogActions>
            </Box>
        </Dialog>
    </React.Fragment>
};

export default CityList;
