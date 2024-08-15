import Heading from "../components/Heading"
import SubHeading from '../components/SubHeading'
import InputBox from '../components/InputBox'
import Button from "../components/Button"
import BottomText from "../components/BottomText"
import { useState, useEffect } from "react"
import axios from "axios"
import Error from "../components/Error"
import { useNavigate } from "react-router-dom"

function Signup() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit() {

        if (email === "") {
            setError("Please enter Email");
        } else if (password === "") {
            setError("Please enter password");
        } else if (firstName === "") {
            setError("Please enter first name");
        } else if (lastName === "") {
            setError("Please enter last name");
        } else {
            const resp = await axios.post(import.meta.env.VITE_BACKEND_URL + "user/signup", {
                firstName,
                lastName,
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
            <div className="flex flex-col justify-center ">
                <div className="rounded-lg bg-white text-center w-80 p-2 pb-4 h-max px-7 ">
                    <Heading label={"Sign up"} />
                    <SubHeading label={"Enter your infromation to create an account"} />
                    <InputBox onChange={(e) => {
                        setFirstName(e.target.value)
                    }} placeholder="Peter" label={"First Name"} />
                    <InputBox onChange={(e) => {
                        setLastName(e.target.value)
                    }} placeholder="Parker" label={"Last Name"} />
                    <InputBox onChange={(e) => {
                        setEmail(e.target.value)
                    }} placeholder="peter@gmail.com" label={"Email"} />
                    <InputBox onChange={(e) => {
                        setPassword(e.target.value)
                    }} placeholder="123456789" label={"Password"} />
                    <div className="pt-4">
                        <Button onClick={handleSubmit} label={"Sign up"} />
                    </div>
                    <Error err={error} />
                    <BottomText label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
                </div>
            </div>
        </div>
    )
}

export default Signup