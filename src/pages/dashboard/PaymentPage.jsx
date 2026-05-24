import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { useNavigate, useLocation } from 'react-router-dom'

import profilePhoto from '../../assets/icon/Profile Photo.png'

export default function PaymentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const service = location.state?.service

  const [showSaldo, setShowSaldo] = useState(false)
  const [profile, setProfile] = useState(null)
  const [balance, setBalance] = useState(0)

  const [isLoading, setIsLoading] = useState(false)

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState(null) 
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!service) {
      navigate('/home')
      return
    }
    fetchData()
  }, [service, navigate])

  const fetchData = async () => {
    try {
      const [profileRes, balanceRes] = await Promise.all([
        api.get('/profile'),
        api.get('/balance')
      ])
      
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

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number).replace('Rp', 'Rp ')
  }

  const executePayment = async () => {
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      const res = await api.post('/transaction', { service_code: service.service_code })
      if (res.data.status === 0) {
        setTransactionStatus('success')
        fetchData() 
      } else {
        setTransactionStatus('failed')
        setErrorMessage(res.data.message || 'Pembayaran Gagal')
      }
    } catch (error) {
      setTransactionStatus('failed')
      setErrorMessage(error.response?.data?.message || 'Terjadi kesalahan sistem')
    } finally {
      setIsLoading(false)
      setShowConfirmModal(false) 
    }
  }

  const closeResultModal = () => {
    setTransactionStatus(null)
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-white relative">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-10 relative">
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

        <section className="mb-4 mt-6">
          <div className="w-full">
            <p className="text-gray-600 text-lg mb-2">PemBayaran</p>
            <div className="flex items-center gap-3">
              {service && <img src={service.service_icon} alt="Icon" className="w-8 h-8 md:w-10 md:h-10" />}
              <h1 className="text-2xl font-bold">
                {service ? service.service_name : 'Loading...'}
              </h1>
            </div>
          </div>
        </section>

        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full flex flex-col gap-4 mt-2">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V4.22c0-.758-.741-1.318-1.485-1.124a60.214 60.214 0 00-15.765 2.115m15.797 2.1l-15.797-2.1m15.797 2.1V19.5" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={service ? service.service_tariff.toLocaleString('id-ID') : ''}
                  readOnly
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none max-w-full bg-white text-gray-800"
                />
              </div>
            </div>

            <button
              onClick={() => setShowConfirmModal(true)} 
              disabled={isLoading || !service}
              className={`w-full py-3 rounded-md font-semibold text-white transition ${
                isLoading || !service
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Bayar
            </button>
          </div>

        </section>

      </main>

      {(showConfirmModal || transactionStatus) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          {showConfirmModal && !transactionStatus && (
            <div className="bg-white rounded-xl p-8 w-[340px] text-center shadow-xl">
              <div className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V4.22c0-.758-.741-1.318-1.485-1.124a60.214 60.214 0 00-15.765 2.115m15.797 2.1l-15.797-2.1m15.797 2.1V19.5" />
                </svg>
              </div>
              <p className="text-gray-600 text-[15px] mb-1">Beli {service?.service_name} senilai</p>
              <p className="text-2xl font-bold mb-8">Rp{service?.service_tariff.toLocaleString('id-ID')} ?</p>
              
              <div className="space-y-4">
                <button 
                  onClick={executePayment} 
                  disabled={isLoading}
                  className="font-bold text-red-500 block w-full hover:opacity-80 transition disabled:opacity-50"
                >
                  {isLoading ? 'Memproses...' : 'Ya, lanjutkan Bayar'}
                </button>
                <button 
                  onClick={() => setShowConfirmModal(false)} 
                  disabled={isLoading}
                  className="text-gray-400 font-medium block w-full hover:text-gray-500 transition"
                >
                  Batalkan
                </button>
              </div>
            </div>
          )}

          {transactionStatus && (
             <div className="bg-white rounded-xl p-8 w-[340px] text-center shadow-xl">
              <div className={`w-14 h-14 text-white rounded-full flex items-center justify-center mx-auto mb-4 ${transactionStatus === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                {transactionStatus === 'success' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-7 h-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              
              <p className="text-gray-600 text-[15px] mb-1">Pembayaran {service?.service_name} sebesar</p>
              <p className="text-2xl font-bold mb-1">Rp{service?.service_tariff.toLocaleString('id-ID')}</p>
              <p className="text-gray-600 text-[15px] mb-8">
                {transactionStatus === 'success' ? 'berhasil!' : 'gagal'}
                {transactionStatus === 'failed' && errorMessage && (
                  <span className="block mt-1 text-red-500 text-sm font-semibold">{errorMessage}</span>
                )}
              </p>
              
              <button 
                onClick={closeResultModal} 
                className="font-bold text-red-500 block w-full hover:opacity-80 transition"
              >
                Kembali ke Beranda
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  )
}