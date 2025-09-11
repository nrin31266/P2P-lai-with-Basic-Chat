import React from 'react'
import LeftBar from '../components/LeftBar'

const Home = () => {
  return (
    <div className='p-4 grid grid-cols-[auto_1fr] gap-4'>
        <LeftBar/>
        <div>Main Chat</div>
    </div>
  )
}

export default Home