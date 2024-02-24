import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const PaginationRounded = ({ handlepageChange }) => {
    const handleChange = (event, value) => {
        handlepageChange(value);
        console.log("page ==>", value);
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Stack spacing={2}>
                <Pagination count={10} variant="outlined" shape="rounded" onChange={handleChange} />
            </Stack>
        </div>
    );
}

export default PaginationRounded;
