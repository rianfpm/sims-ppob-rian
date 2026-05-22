import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/icon/Logo.png'

export default function Navbar() {
  const location = useLocation()

  const navLinks = [
    { name: 'Top Up', path: '/topup' },
    { name: 'Transaction', path: '/transaction' },
    { name: 'Akun', path: '/profile' },
  ]

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo & Brand */}
          <Link to="/home" className="flex items-center gap-3">
            <img src={logo} alt="SIMS PPOB Logo" className="w-7 h-7" />
            <span className="font-bold text-xl">SIMS PPOB</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path)

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition hover:text-red-500 ${
                    isActive ? 'text-red-500' : 'text-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
