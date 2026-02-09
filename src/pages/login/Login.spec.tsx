import {describe, expect, it} from "vitest"
import {render,screen} from "@testing-library/react"
import LoginPage from "./Login"


describe('Login page', () => { 
    // use describe we can group multiple test case 

    it("Should render with required fields",()=>{
            render(<LoginPage/>);
            // getBy --- throw error 
            // findBy --- for async  
            // queryby --- null
            expect(screen.getByText('Sign in')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
            expect(screen.getByRole('button',{name:'Log in'})).toBeInTheDocument()
            expect(screen.getByRole("checkbox",{name:"Remember me"})).toBeInTheDocument();
            expect(screen.getByText('Forgot password')).toBeInTheDocument()
          
    })
 })