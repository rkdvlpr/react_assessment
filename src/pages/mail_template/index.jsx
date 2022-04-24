import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip, Button, IconButton, Hidden } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { SET_MAIL_TEMPLATE } from '../../store/common';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { useNavigate } from 'react-router-dom';

const MailTemplate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(state => state.common.mail_templates);

    const getTemplates = React.useCallback(() => {
        http.get('/api/mail-template').then((res) => dispatch(SET_MAIL_TEMPLATE(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getTemplates()
    }, [getTemplates]);

    const tableHooks = (hooks) => {
        hooks.visibleColumns.push((columns) => [
            ...columns,
            {
                id: "action",
                Header: "Action",
                accessor: "_id",
                disableSortBy: true,
                Cell: ({ row }) => {
                    return (<IconButton onClick={() => navigate(`/mail-template/${row.original?._id}/edit`)} aria-label="edit" color="primary">
                        <EditIcon />
                    </IconButton>)
                }
            },
        ]);
    };

    const columnsData = React.useMemo(() => [
        { Header: "Sr. No.", accessor: (_row, i) => i + 1, disableSortBy: true },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Subject', accessor: 'subject' },
        { Header: 'Description', accessor: 'description' }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={
            <React.Fragment>
                <Tooltip title="Add New Template">
                    <Button variant="contained" endIcon={<AddIcon />} onClick={() => navigate('/mail-template/add')}>
                        <Hidden only={'xs'}>Add New Template</Hidden>
                    </Button>
                </Tooltip>
            </React.Fragment>
        } />
    </React.Fragment>
}

export default MailTemplate;