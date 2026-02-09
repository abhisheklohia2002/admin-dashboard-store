import React from 'react'

export default function LoginPage() {
  return (
    <div>
        <h1>
            Sign in
        </h1>
        <input type="text" placeholder='Username' name="" id="" />
        <input type="text" placeholder='Password' name="" id="" />
        <button>
            Log in
        </button>
        <label htmlFor="remember-me">
            Remember me
        </label>
        <input type="checkbox" name="" id="remember-me" />
        <a href="#">
            Forgot password
        </a>
    </div>
  )
}
