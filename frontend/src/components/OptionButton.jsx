import React from 'react'

function OptionButton({ onClick, label, color }) {
    return (
        <button className={`mr-5 underline text-${color}-800 sm:text-lg text-sm mb-2 sm:mt-0 mt-2`}
            onClick={onClick}>{label}</button>
    )
}

export default OptionButton