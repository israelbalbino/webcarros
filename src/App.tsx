import { createBrowserRouter } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import New from './Pages/Dashboard/New';
import Details from './Pages/Details';
import { Private } from './routes/Private';

import Layout from '../src/Components/layout'

const router = createBrowserRouter([
  {
  element: <Layout/>,
  children:[
    {
    path:"/",
    element:<Home/>
  },
  {
    path:"/details/:id",
    element:<Details/>
   },
 {
  path:"/dashboard",
  element:<Private><Dashboard/></Private>
 },
 {
  path:"/dashboard/new",
  element:<Private><New/></Private>
 }
]
},
{
  path:"/login",
  element:<Login/>
},
{
  path:"/register",
  element:<Register/>
}

])

export {router};
