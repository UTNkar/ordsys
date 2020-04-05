import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <>
            <Link to="/bar">
                Bar
            </Link>
            <Link to="/kitchen">
                Kitchen
            </Link>
            <Link to="/statistics">
                Statistics
            </Link>
        </>
    );
}

export default Home
