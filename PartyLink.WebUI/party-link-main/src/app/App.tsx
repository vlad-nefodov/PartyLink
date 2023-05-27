import { Routes, Route } from 'react-router-dom'

import AuthLayout from '../layouts/AuthLayout/AuthLayout'
import Layout from '../layouts/Layout/Layout'

import LoginPage from '../pages/LoginPage/LoginPage'
import SignupPage from '../pages/SignupPage/SignupPage'
import MapPage from '../pages/MapPage/MapPage'
import SettingsPage from '../pages/SettingsPage/SettingsPage'
import ProfilePage from '../pages/ProfilePage/ProfilePage'

function App() {
  return (
    <Routes>
      <Route path="/*" element={<AuthLayout />}>
        <Route index element={<MapPage />} />
        <Route path="profile/:id" element={<ProfilePage />} />
        <Route path="event/:id" element={<div>Event</div>} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="/*" element={<Layout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
    </Routes >
  )
}

export default App
