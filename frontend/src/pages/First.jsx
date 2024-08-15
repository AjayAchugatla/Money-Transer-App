import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function First() {

    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("token"))
            navigate("/dashboard");
        else
            navigate("/signin");
    })
    return (
        <div></div>
    )
}

export default First