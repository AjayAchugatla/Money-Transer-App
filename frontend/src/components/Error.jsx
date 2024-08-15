import React from 'react'

function Error({ err }) {
    return (
        <div className='text-sm text-red-600 my-1 text-center'>
            {err}
        </div>
    )
}

export default Error