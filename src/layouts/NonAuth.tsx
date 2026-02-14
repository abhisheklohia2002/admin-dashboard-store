import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/store'

export default function NonAuth() {
  const location = useLocation()
    const {user} = useAuthStore();
    if(user !== null){
      const returnTo = new URLSearchParams(location.search).get("returnTo") || "/"
        return <Navigate to={returnTo} replace  />
    }
  return (
    <div>
        <Outlet/>
    </div>
  )
}
