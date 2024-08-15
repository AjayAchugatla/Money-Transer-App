import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Error from '../components/Error'
import Heading from '../components/Heading'
import InputBox from '../components/InputBox'

function Delete() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [password, setPassword] = useState("");

    const deleteAcc = async () => {
        if (password === "") {
            setError("Please Enter Password");
        } else {
            const resp = await axios.delete(import.meta.env.VITE_BACKEND_URL + 'user/', {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                },
                data: {
                    password: password
                }
            });
            if (resp.data.error) {
                setError(resp.data.error)
            } else {
                navigate('/signin');
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
                    <Heading label={'Delete Account'} />
                    <div className="flex flex-col">
                        <h4 className='text-center text-sm text-gray-500'>To Delete your account enter the password</h4>
                    </div>
                    <div className="p-4">
                        <InputBox onChange={(e) => {
                            setPassword(e.target.value)
                        }} placeholder="" label={" Password*"} />
                        <Error err={error} />
                        <button onClick={deleteAcc} className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 py-2 w-full bg-red-500 text-white mt-4">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Delete