import * as React from 'react';
import { IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TableComponent from '../../components/TableComponent';
import http from "../../utils/http";
import { useNavigate, useParams } from 'react-router-dom';

const CandidateList = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [items, setCandidate] = React.useState([]);

    const getCandidate = React.useCallback(() => {
        http.get(`/api/candidate/batch/${id}`).then((res) => setCandidate(res.data));
    }, [id]);

    React.useEffect(() => {
        getCandidate();
    }, [getCandidate]);

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
                        <IconButton onClick={() => navigate(`/candidate/${row.original?._id}/edit`)} aria-label="edit" color="primary">
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="view" color="info">
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
        { Header: 'Candidate ID', accessor: 'candidate_id' },
        { Header: 'Name', accessor: 'name' },
        { Header: 'Mobile', accessor: 'mobile' },
        { Header: 'Father', accessor: 'father_name' }
    ], []);

    const rowData = React.useMemo(() => [...items], [items]);

    return <React.Fragment>
        <TableComponent columns={columnsData} data={rowData} tableHooks={tableHooks} topComponent={null} />
    </React.Fragment>
}

export default CandidateList;