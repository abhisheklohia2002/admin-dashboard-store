import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/store'

export default function Dashboard() {
    const {user} = useAuthStore();
    if(user === null){
        return <Navigate to="/auth/login" replace  />
    }
  return (
    <div>
        <h1>Dashboard</h1>
        <Outlet/>
    </div>
  )
}
