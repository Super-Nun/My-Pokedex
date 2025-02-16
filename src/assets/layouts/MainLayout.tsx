import Header from '../components/Header'
import { Outlet } from 'react-router'
import Footer from '../components/Footer'

export default function MainLayout() {
  return (
    <div>
        <Header />
        <div>
            <Outlet />
        </div>
        <Footer />
    </div>
  )
}
