import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Appbar from "../components/Appbar"
import Balance from "../components/Balance"
import Users from '../components/Users'
import axios from 'axios'

function Dashboard() {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [name, setName] = useState("");
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
            else {
                setName(info.data.userInfo.firstName + " " + info.data.userInfo.lastName);
            }
        } else {
            navigate('/signin')
        }

    }

    const getBal = async () => {
        const resp = await axios.get(import.meta.env.VITE_BACKEND_URL + 'account/balance', {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        setBalance(resp.data.balance)
    }

    useEffect(() => {
        getBal()
        verify()
    }, [])

    return (
        <div >
            <Appbar name={name} />
            <div className='mx-8 mt-5'>
                <Balance balance={balance} />
                <Users />
            </div>
        </div>
    )
}

export default Dashboard