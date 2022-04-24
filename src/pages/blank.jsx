import * as React from 'react';
import Button from '@mui/material/Button';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

const Blank = () => {

    const [user, setUser] = React.useState({
        password: '',
        repeatPassword: '',
    });

    const handleChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
    }

    const handleSubmit = () => {
        // your submit logic
    }

    return <ValidatorForm
        onSubmit={handleSubmit}
    >
        <TextValidator
            label="Password"
            onChange={handleChange}
            name="password"
            type="password"
            validators={['required']}
            errorMessages={['this field is required']}
            value={user.password}
        />
        <Button type="submit">Submit</Button>
    </ValidatorForm>
};
export default Blank;