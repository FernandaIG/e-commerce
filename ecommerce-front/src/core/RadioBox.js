import React, { useState, useEffect, Fragment } from 'react';

const RadioBox = ({ prices }) => {
    const [value, setValue] = useState(0);

    return (
        <Fragment>
            {JSON.stringify(prices)}
            <input type="radio" className="mr-2 ml-4" />
            <label className="form-check-label">Name</label>
        </Fragment>
    );
}

export default RadioBox;