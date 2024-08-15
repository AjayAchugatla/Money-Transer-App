import React, { useEffect, useState } from 'react'
import Heading from "../components/Heading"
import SubHeading from '../components/SubHeading'
import InputBox from '../components/InputBox'
import Button from "../components/Button"
import BottomText from "../components/BottomText"
import { useNavigate } from 'react-router-dom'
import Error from "../components/Error"
import axios from 'axios'

function Signin() {
    const navigate = useNavigate()
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit() {

        if (email === "") {
            setError("Please enter Email");
        } else if (password === "") {
            setError("Please enter password");
        }
        else {
            setError("")
            const resp = await axios.post(import.meta.env.VITE_BACKEND_URL + "user/signin", {
                email,
                password
            })
            if (resp.data.token) {
                localStorage.setItem("token", resp.data.token)
                navigate('/dashboard')
            } else {
                setError(resp.data.error);
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
            if (info.data.userInfo)
                navigate('/dashboard')
        }

    }

    useEffect(() => {
        verify()
    }, [])

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white text-center w-80 p-2 pb-4 h-max px-7  ">
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    <InputBox onChange={(e) => {
                        setEmail(e.target.value)
                    }} placeholder="peter@gmail.com" label={"Email"} />
                    <InputBox onChange={(e) => {
                        setPassword(e.target.value)
                    }} placeholder="123456789" label={"Password"} />
                    <div className="pt-4">
                        <Button onClick={handleSubmit} label={"Sign in"} />
                    </div>
                    <Error err={error}></Error>
                    <BottomText label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                </div>
            </div>
        </div>
    )
}

export default Signin