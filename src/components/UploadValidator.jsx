import React from 'react';
import red from '@mui/material/colors/red';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { ValidatorComponent } from 'react-material-ui-form-validator';

const Input = styled('input')({
    display: 'none',
});

const red300 = red['500'];

const style = {
    fontSize: '12px',
    color: red300
};

class UploadValidator extends ValidatorComponent {

    renderValidatorComponent() {
        const { errorMessages, validators, requiredError, value, id, className, color, variant, component, lebel, ...rest } = this.props;
        const id_attr = id ? id : Math.random().toString(36).replace(/[^a-z]+/g, '').substring(2, 10);
        return (
            <>
                <label htmlFor={id_attr} className={className}>
                    <Input {...rest} id={id_attr} ref={(r) => { this.input = r; }} />
                    <Button color={color || 'primary'} variant={variant || "contained"} component={component || "span"}>
                        {lebel ? lebel : 'Select File'}
                    </Button>
                </label>
                {this.errorText()}
            </>
        );
    }

    errorText() {
        const { isValid } = this.state;

        if (isValid) {
            return null;
        }

        return (
            <div style={style}>
                {this.getErrorMessage()}
            </div>
        );
    }
}

export default UploadValidator;