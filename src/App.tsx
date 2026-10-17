import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Layout from './Layout/Layout'
import Home from './Pages/Home/Home'
import NotFound from './Pages/NotFound/NotFound'
import Profile from './Pages/Profile/Profile'
import Register from './Pages/Register/Register'
import Login from './Pages/Login/Login'
import LoginContextProvider from './Context/LoginContext'
import ProtectedRout from './Components/ProtectedRout/ProtectedRout'
import AuthProtectedRout from './Components/ProtectedRout/AuthProtectedRout'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SinglePost from './Pages/SinglePost/SinglePost'
import { Toaster } from './../node_modules/react-hot-toast/src/components/toaster';
import useNetworkState from './../node_modules/react-use/esm/useNetworkState';
import Offline from './Components/Offline/Offline'

const query = new QueryClient()

function App() {

  const {online} = useNetworkState()

  const router  = createBrowserRouter([
    {path: "", element: <Layout/> , children: [
      {index : true , element: <ProtectedRout> <Home/> </ProtectedRout>} ,
      {path : "profile" , element:<ProtectedRout> <Profile/> </ProtectedRout> } ,
      {path : "postdetails/:id" , element:<ProtectedRout> <SinglePost/> </ProtectedRout> } ,
      {path : "register" , element: <AuthProtectedRout> <Register/> </AuthProtectedRout> } ,
      {path : "login" , element: <AuthProtectedRout> <Login/> </AuthProtectedRout>} ,
      {path : "*" , element: <NotFound/>} ,
    ] },
  ])

  
  return (
    <>
    {!online && <Offline onRetry={() => query.refetchQueries()} />}
    <QueryClientProvider client={query}>
    <LoginContextProvider>
      <Toaster/>
    <RouterProvider router={router}>
    </RouterProvider>
    </LoginContextProvider>
    </QueryClientProvider>
    </>
  )
}

export default App

