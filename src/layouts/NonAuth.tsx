import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/store'

export default function NonAuth() {
    const {user} = useAuthStore();
    if(user !== null){
        return <Navigate to="/home" replace  />
    }
  return (
    <div>
        <Outlet/>
    </div>
  )
}
