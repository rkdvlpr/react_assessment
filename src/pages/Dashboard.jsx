import { Grid } from "@mui/material";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import MetroCard from "../components/MetroCard";
import { SET_DASHBOARD_COUNT } from "../store/common";
import http from "../utils/http";

const Dashboard = () => {
    const dispatch = useDispatch();
    const counts = useSelector(state => state.common.dashboard_count);

    const getDashboardCount = React.useCallback(() => {
        http.get('/api/dashboard/counts').then((res) => dispatch(SET_DASHBOARD_COUNT(res.data)));
    }, [dispatch]);

    React.useEffect(() => {
        getDashboardCount();
    }, [getDashboardCount]);

    return <React.Fragment>
        <Grid container spacing={2}>
            {Object.keys(counts).length > 0 && Object.keys(counts).map((key, idx) => (
                <Grid item xs={12} md={3} key={idx}>
                    <MetroCard title={key} value={counts[key]} />
                </Grid>
            ))}
        </Grid>
    </React.Fragment>
}

export default Dashboard;