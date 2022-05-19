import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Button, IconButton, Box, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { SET_STRATEGY } from '../../store/strategy';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { useNavigate } from 'react-router-dom';

const Strategy = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(state => state.strategy.items);

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
                    return (<IconButton disabled onClick={() => navigate(`/strategy/${row.original?._id}/edit`)} aria-label="edit" color="primary">
                        <EditIcon />
                    </IconButton>)
                }
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Sector', accessor: 'sector.name' },
        { Header: 'Jobrole', accessor: 'jobrole.name' },
        { Header: 'Assessment Type', accessor: d =>{
            var asstype = [];
            for (const strgy in d.strategy) {
                if(d.strategy[strgy].length > 0){
                    asstype.push(strgy);
                }
            }
            return asstype.join(", ");
        } },
        { Header: 'Duration', accessor: 'duration' },
        { Header: 'Pass Marks', accessor: 'pass_percentage' }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

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
    </React.Fragment>
}

export default Strategy;