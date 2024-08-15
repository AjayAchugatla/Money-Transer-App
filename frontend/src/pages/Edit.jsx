import React, { useState, useEffect } from 'react'
import Heading from '../components/Heading'
import Error from '../components/Error'
import InputBox from '../components/InputBox'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
function Edit() {

    const [error, setError] = useState("")
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [curPassword, setCurPassword] = useState("");
    const navigate = useNavigate()

    async function handleSubmit() {

        if (password === "" && firstName === "" && lastName === "") {
            setError("Nothing is provided to change");
        } else if (curPassword === "") {
            setError("Please provide current password to make changes");
        } else {
            const payload = {};
            payload.current = curPassword
            if (firstName !== "") {
                payload.firstName = firstName;
            }
            if (lastName !== "") {
                payload.lastName = lastName;
            }
            if (password !== "") {
                payload.password = password;
            }
            const resp = await axios.put(import.meta.env.VITE_BACKEND_URL + "user/", payload, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            if (resp.data.error) {
                setError(resp.data.error);
            } else {
                navigate('/dashboard')
            }
        }
    }

    const verify = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const info = await axios.get(import.meta.env.VITE_BACKEND_URL + 'user/me', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            if (!info.data.userInfo)
                navigate('/signin')
        }
        else {
            navigate('/signin')
        }

    }

    useEffect(() => {
        verify()
    }, [])


    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="h-full flex flex-col justify-center">
                <div className="border h-min max-w-md p-4 space-y-3 w-96 bg-white shadow-lg rounded-lg">
                    <Heading label={'Edit Your Details'} />
                    <div className="flex flex-col">
                        <h4 className='text-center text-sm text-gray-500'>You can edit one or all of the below</h4>
                        <h4 className='text-center text-sm text-gray-500'>To make changes current password is necessary</h4>
                    </div>
                    <div className="p-4">
                        <InputBox onChange={(e) => {
                            setFirstName(e.target.value)
                        }} placeholder="" label={"First Name"} />
                        <InputBox onChange={(e) => {
                            setLastName(e.target.value)
                        }} placeholder="" label={"Last Name"} />
                        <InputBox onChange={(e) => {
                            setCurPassword(e.target.value)
                        }} placeholder="" label={"Current Password*"} />
                        <InputBox onChange={(e) => {
                            setPassword(e.target.value)
                        }} placeholder="" label={"New Password"} />
                        <Error err={error} />
                        <button onClick={handleSubmit} className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 py-2 w-full bg-blue-500 text-white mt-4">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Edit