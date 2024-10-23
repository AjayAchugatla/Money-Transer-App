import React, { useState, useEffect } from 'react'
import Heading from "../components/Heading"
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from "axios"
import Error from '../components/Error'
function SendMoney() {
    const [searchParams] = useSearchParams()
    const [amount, setAmount] = useState(0)
    const [error, setError] = useState("")
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const navigate = useNavigate()

    const transfer = async () => {
        if (amount === 0)
            setError("Enter Amount")
        else if(amount<0)
            setError("Enter Valid Amount")
        else {
            const resp = await axios.post(import.meta.env.VITE_BACKEND_URL + 'account/transfer', {
                amount: amount,
                to: id
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            if (resp.data.error) {
                setError(resp.data.error)
            }
            else
                navigate('/');
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
                navigate('signin')

        } else {
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
                    <Heading label={'Send Money'} />
                    <div className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-2xl text-white">{name ? name[0] : ""}</span>
                            </div>
                            <h3 className="text-2xl font-semibold">{name}</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="amount"
                                >
                                    Amount (in Rs)
                                </label>
                                <input
                                    type="number"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    id="amount"
                                    min={1}
                                    placeholder="Enter amount"
                                    onChange={(e) => {
                                        setAmount(e.target.value)
                                    }}
                                />
                            </div>
                            <Error err={error} />
                            <button onClick={transfer} className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white">
                                Initiate Transfer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SendMoney
