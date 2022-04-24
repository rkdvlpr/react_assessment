import React, { useRef, useMemo } from 'react';
import PropTypes from "prop-types";
import JoditEditor from "jodit-react";

const HtmlEditor = ({ value, placeholder, onChange }) => {
    const editor = useRef(null)

    const config = useMemo(() => {
        return {
            readonly: false, // all options from https://xdsoft.net/jodit/doc/,
            placeholder: placeholder || 'Start typings...',
            height: 500
        };
    }, [placeholder]);

    return (
        <JoditEditor
            ref={editor}
            value={value}
            config={config}
            tabIndex={1}
            onChange={onChange}
        />
    );
};

HtmlEditor.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string
};

export default React.memo(HtmlEditor);