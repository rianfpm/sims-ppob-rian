import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

import profilePhoto from '../../assets/icon/Profile Photo.png'

export default function HomePage() {
  const [showSaldo, setShowSaldo] = useState(false)
  const [services, setServices] = useState([])
  const [banners, setBanners] = useState([])
  const [profile, setProfile] = useState(null)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, bannersRes, profileRes, balanceRes] = await Promise.all([
          api.get('/services'),
          api.get('/banner'),
          api.get('/profile'),
          api.get('/balance')
        ])
        
        if (servicesRes.data.status === 0) {
          setServices(servicesRes.data.data)
        }
        if (bannersRes.data.status === 0) {
          setBanners(bannersRes.data.data)
        }
        if (profileRes.data.status === 0) {
          setProfile(profileRes.data.data)
        }
        if (balanceRes.data.status === 0) {
          setBalance(balanceRes.data.data.balance)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number).replace('Rp', 'Rp ')
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="w-full md:w-1/2">
            <img
              src={profile?.profile_image && profile.profile_image.includes('http') && !profile.profile_image.includes('null') ? profile.profile_image : profilePhoto}
              alt="Profile"
              className="w-20 h-20 rounded-full mb-4 object-cover border border-gray-200"
            />
            <p className="text-gray-600 text-lg">Selamat datang,</p>
            <h1 className="text-3xl font-bold">
              {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
            </h1>
          </div>
          <div className="w-full md:w-1/2 bg-red-500 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-full opacity-20 hidden md:block">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <path
                  d="M 50 100 C 50 50, 150 50, 150 0 M 70 100 C 70 50, 170 50, 170 0 M 90 100 C 90 50, 190 50, 190 0 M 110 100 C 110 50, 210 50, 210 0"
                  stroke="white" strokeWidth="2" fill="none"
                />
              </svg>
            </div>
            
            <p className="mb-2 text-sm z-10 relative">Saldo anda</p>
            <h2 className="text-4xl font-bold mb-4 z-10 relative">
              {showSaldo ? formatRupiah(balance) : 'Rp ••••••••'}
            </h2>
            <button
              onClick={() => setShowSaldo(!showSaldo)}
              className="text-xs flex items-center gap-2 relative z-10 hover:opacity-80 transition"
            >
              <span>{showSaldo ? 'Sembunyikan Saldo' : 'Lihat Saldo'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                {showSaldo ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                )}
              </svg>
            </button>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-y-8 gap-x-2">
            {services.map((srv, idx) => (
              <div key={idx} className="flex flex-col items-center cursor-pointer hover:opacity-80 transition group text-center">
                <img src={srv.service_icon} alt={srv.service_name} className="w-14 h-14 mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-gray-700 max-w-[70px] leading-tight font-medium">
                  {srv.service_name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-4">Temukan promo menarik</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {banners.map((banner, idx) => (
              <div key={idx} className="min-w-[280px] md:min-w-[320px] snap-center">
                <img
                  src={banner.banner_image}
                  alt={banner.banner_name}
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
