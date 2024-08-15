import React from 'react'
import { useNavigate } from "react-router-dom"
import OptionButton from "./OptionButton"
function Appbar({ name }) {

    const navigate = useNavigate("/");
    return (
        <div className="shadow h-14 flex justify-between mb-4">
            <div className="flex flex-col justify-center h-full ml-4">
                Payments App
            </div>
            <h2 className='text-3xl text-center mt-2 md:block hidden ml-12'><b>Hello </b><i>{name}!</i></h2>
            <div className="flex">
                <OptionButton label={"Edit"} color={"blue"} onClick={() => {
                    navigate('/edit');
                }} />
                <OptionButton label={"Logout"} color={"blue"} onClick={() => {
                    localStorage.removeItem("token");
                    navigate('/signin');
                }} />
                <OptionButton label={"Delete"} color={"red"} onClick={() => {
                    navigate('/delete')
                }} />
            </div>
        </div>
    )
}

export default Appbar