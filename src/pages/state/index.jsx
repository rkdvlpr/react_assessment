import * as React from 'react';
import { IconButton } from '@mui/material';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import ViewListIcon from '@mui/icons-material/ViewList';
import { useNavigate } from 'react-router-dom';
import { SET_STATE } from '../../store/common';
import { useDispatch, useSelector } from 'react-redux';

const State = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(state => state.common.states);

    const getStates = React.useCallback(() => {
        http.get('/api/state').then((res) => dispatch(SET_STATE(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getStates();
    }, [getStates]);

    const tableHooks = (hooks) => {
        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "",
                Header: "Action",
                accessor: "_id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<IconButton onClick={() => navigate(`/state/${row.original._id}`)} aria-label="list" color="primary">
                        <ViewListIcon />
                    </IconButton>)
                }
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Code', accessor: 'code' }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={null} />
    </React.Fragment>
};

export default State;
