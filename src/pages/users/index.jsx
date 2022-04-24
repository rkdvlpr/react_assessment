import * as React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Paper } from '@mui/material';
// import Candidate from './Candidate';
import Assessor from './Assessor';

const Users = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return <React.Fragment>
        <Paper className='mb-5'>
            <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs example">
                <Tab label="Assessor" {...a11yProps(0)} />
                {/* <Tab label="Candidate" {...a11yProps(1)} /> */}
            </Tabs>
        </Paper>
        <TabPanel value={value} index={0}>
            <Assessor />
        </TabPanel>
        {/* <TabPanel value={value} index={1}>
            <Candidate />
        </TabPanel> */}
    </React.Fragment>
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <React.Fragment>{children}</React.Fragment>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default Users;