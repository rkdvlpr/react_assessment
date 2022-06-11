import PropTypes from "prop-types";
import { Avatar, Card, CardContent, Grid, Typography } from '@mui/material';
import DonutLargeIcon from '@mui/icons-material/DonutLarge';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import ClassIcon from '@mui/icons-material/Class';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import GroupIcon from '@mui/icons-material/Group';
import TranslateIcon from '@mui/icons-material/Translate';
import LayersIcon from '@mui/icons-material/Layers';
import QuizIcon from '@mui/icons-material/Quiz';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';

const getIcons = (key) => {
    if (key === 'state') {
        return <Avatar sx={{ backgroundColor: 'primary.main', height: 56, width: 56 }}>
            <DonutLargeIcon />
        </Avatar>
    } else if (key === 'city') {
        return <Avatar sx={{ backgroundColor: 'secondry.main', height: 56, width: 56 }}>
            <DonutSmallIcon />
        </Avatar>
    } else if (key === 'sector') {
        return <Avatar sx={{ backgroundColor: 'warning.main', height: 56, width: 56 }}>
            <CorporateFareIcon />
        </Avatar>
    } else if (key === 'jobrole') {
        return <Avatar sx={{ backgroundColor: 'error.main', height: 56, width: 56 }}>
            <ClassIcon />
        </Avatar>
    } else if (key === 'batch') {
        return <Avatar sx={{ backgroundColor: 'info.main', height: 56, width: 56 }}>
            <BatchPredictionIcon />
        </Avatar>
    } else if (key === 'candidate') {
        return <Avatar sx={{ backgroundColor: 'primary.main', height: 56, width: 56 }}>
            <GroupIcon />
        </Avatar>
    } else if (key === 'assessor') {
        return <Avatar sx={{ backgroundColor: 'error.main', height: 56, width: 56 }}>
            <GroupIcon />
        </Avatar>
    } else if (key === 'language') {
        return <Avatar sx={{ backgroundColor: 'info.main', height: 56, width: 56 }}>
            <TranslateIcon />
        </Avatar>
    } else if (key === 'difficulty') {
        return <Avatar sx={{ backgroundColor: 'warning.main', height: 56, width: 56 }}>
            <LayersIcon />
        </Avatar>
    } else if (key === 'question') {
        return <Avatar sx={{ backgroundColor: 'warning.main', height: 56, width: 56 }}>
            <QuizIcon />
        </Avatar>
    } else if (key === 'strategy' || key === 'sets') {
        return <Avatar sx={{ backgroundColor: 'info.main', height: 56, width: 56 }}>
            <EmojiObjectsIcon />
        </Avatar>
    } else {
        return null;
    }
};

const MetroCard = (props) => (
    <Card
        sx={{ height: '100%' }}
        {...props}
    >
        <CardContent>
            <Grid
                container
                spacing={3}
                sx={{ justifyContent: 'space-between' }}
            >
                <Grid item>
                    <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="overline"
                    >
                        {props.title}
                    </Typography>
                    <Typography
                        color="textPrimary"
                        variant="h4"
                    >
                        {props.value}
                    </Typography>
                </Grid>
                <Grid item>
                    {getIcons(props.title)}
                </Grid>
            </Grid>
        </CardContent>
    </Card>
);

MetroCard.propType = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
};

export default MetroCard;