import React from 'react'

function Heading({ label }) {
    return (
        <div className='font-bold text-4xl pt-2 text-center'>
            {label}
        </div>
    )
}

export default Heading