import React, { useEffect, useState } from 'react'
import User from "./User"
import axios from 'axios';

function Users() {
    const [filter, setFilter] = useState("")
    const [users, setUsers] = React.useState([]);

    const getData = async () => {
        const resp = await axios.get(import.meta.env.VITE_BACKEND_URL + "user/bulk?filter=" + filter, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        setUsers(resp.data.user)
    }

    useEffect(() => {
        getData()
    }, [filter])

    return (
        <>
            <div className="font-bold mt-6 text-lg">
                Users
            </div>
            <div className="my-2">
                <input type="text" onChange={(e) => {
                    setFilter(e.target.value)
                }} placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
            </div>
            <div>
                {users.map((user) => <User key={user._id} user={user} />)}
            </div>
        </>
    )
}

export default Users