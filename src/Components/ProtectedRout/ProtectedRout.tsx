import { Navigate } from "react-router-dom"


export default function AuthProtectedRout({children}) {
 if (!localStorage.getItem("userToken")) {
    return <Navigate to={"/login"}/>
 } else{
    return <>{children}</>
 }
}
