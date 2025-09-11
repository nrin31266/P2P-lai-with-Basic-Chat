

import { Provider } from 'react-redux'
import store from './redux/store'
import WebSocketProvider from './ws/WebSocketProvider'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthGuard from './components/AuthGuard'
import Login from './feature/auth/pages/Login'
import Home from './feature/home/pages/Home'
import AppLayout from './layout/AppLayout'


const App = () => {
  return (
    <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<AuthGuard />}>
              <Route path="/" element={<AppLayout/>}>
                <Route index element={<Home />} />
              </Route>
              <Route path="/auth" >
                <Route path='login' element={<Login />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
    </Provider>
  )
}

export default App