import React from 'react'
import LeftBar from '../components/LeftBar'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className='p-4 grid grid-cols-[auto_1fr] gap-4'>
        <LeftBar/>
        <Outlet/>
    </div>
  )
}

export default Home