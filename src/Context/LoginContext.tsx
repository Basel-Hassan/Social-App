import { createContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import {jwtDecode} from "jwt-decode"

type loginContextType = {
    userLogin : string | null ,
    setUserLogin : Dispatch<SetStateAction<string|null>> ,
    userId : string
}

export const LoginContext = createContext<loginContextType>({
    userLogin : null ,
    setUserLogin : () => {} ,
    userId : ""
})

export default function LoginContextProvider({children} : {children : ReactNode}) {
    const [userLogin, setUserLogin] = useState(() => {return localStorage.getItem("userToken")})

    const [userId, setUserId] = useState("")

    useEffect(() => {
        if (localStorage.getItem("userToken")) {
            const {user} = jwtDecode(localStorage.getItem("userToken"))
            setUserId(user)
            
        }} , [userLogin])

    return <LoginContext.Provider  value={{userLogin , setUserLogin , userId}}> 
    {children}
    </LoginContext.Provider>
} 