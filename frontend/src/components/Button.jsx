import React from 'react'

function Button({ label, onClick }) {
    return (
        <button onClick={onClick} type="button" className=" w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm sm:px-4 py-2.5 me-2 sm:mb-2 mt-1 px-2">{label}</button>
    )
}

export default Button