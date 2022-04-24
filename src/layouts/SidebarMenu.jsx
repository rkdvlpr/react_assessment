import * as React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ClassIcon from '@mui/icons-material/Class';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import SchemaIcon from '@mui/icons-material/Schema';
import EmailIcon from '@mui/icons-material/Email';
import TranslateIcon from '@mui/icons-material/Translate';
import LayersIcon from '@mui/icons-material/Layers';
import QuizIcon from '@mui/icons-material/Quiz';

function ListItemLink(props) {
  const { icon, primary, to } = props;
  const location = useLocation();

  const renderLink = React.useMemo(
    () =>
      React.forwardRef(function Link(itemProps, ref) {
        return <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />;
      }),
    [to],
  );

  return (
    <ListItemButton selected={location.pathname === to} component={renderLink}>
      {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
      <ListItemText primary={primary} />
    </ListItemButton>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export const SidebarMenu = (
  <React.Fragment>
    <ListItemLink to="/" primary="Dashboard" icon={<DashboardIcon />} />
    <ListItemLink to="/language" primary="Language" icon={<TranslateIcon />} />
    <ListItemLink to="/mail-template" primary="Mail Template" icon={<EmailIcon />} />
    <ListItemLink to="/state" primary="State" icon={<LocationOnIcon />} />
    <ListItemLink to="/batch-type" primary="Batch Type" icon={<CardMembershipIcon />} />
    <ListItemLink to="/project-category" primary="Project Category" icon={<SchemaIcon />} />
    <ListItemLink to="/difficulty-level" primary="Difficulty Level" icon={<LayersIcon />} />
    {/* <ListItemLink to="/roles" primary="Roles" icon={<BorderAllIcon />} />
    <ListItemLink to="/users" primary="Users" icon={<PeopleIcon />} /> */}
    <ListItemLink to="/sectors" primary="Sectors" icon={<CorporateFareIcon />} />
    <ListItemLink to="/jobroles" primary="Jobroles" icon={<ClassIcon />} />
    <ListItemLink to="/batch" primary="Batch" icon={<BatchPredictionIcon />} />
    <ListItemLink to="/candidate" primary="Candidate" icon={<GroupIcon />} />
    <ListItemLink to="/assessor" primary="Assessor" icon={<GroupIcon />} />
    <ListItemLink to="/question" primary="Questions" icon={<QuizIcon />} />
  </React.Fragment>
);