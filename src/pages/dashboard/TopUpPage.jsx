import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'

import profilePhoto from '../../assets/icon/Profile Photo.png'

export default function TopUpPage() {
  const navigate = useNavigate()

  const [showSaldo, setShowSaldo] = useState(false)
  const [profile, setProfile] = useState(null)
  const [balance, setBalance] = useState(0)

  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState(null) 
  const [submittedAmount, setSubmittedAmount] = useState(0) 
  const [errorMessage, setErrorMessage] = useState('')

  const predefinedAmounts = [10000, 20000, 50000, 100000, 250000, 500000]

  useEffect(() => {
    fetchData()
  }, [])

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

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setAmount(val)
  }

  const handleTopUpClick = () => {
    const numAmount = Number(amount)
    if (!amount || numAmount < 10000 || numAmount > 1000000) return
    setShowConfirmModal(true)
  }

  const executeTopUp = async () => {
    const numAmount = Number(amount)
    setIsLoading(true)
    setSubmittedAmount(numAmount)
    setErrorMessage('')
    
    try {
      const res = await api.post('/topup', { top_up_amount: numAmount })
      if (res.data.status === 0) {
        setTransactionStatus('success')
        fetchData() 
      } else {
        setTransactionStatus('failed')
        setErrorMessage(res.data.message || 'Top Up Gagal')
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
    setAmount('')
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

        <section className="mb-4">
          <div className="w-full">
            <p className="text-gray-600 text-lg">Silakan Masukan</p>
            <h1 className="text-3xl font-bold">
              Nominal Top Up
            </h1>
          </div>
        </section>

        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-7/12 flex flex-col gap-4">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-gray-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="masukkan nominal Top Up"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 max-w-full"
                />
              </div>
              {amount && Number(amount) < 10000 && (
                <p className="text-red-500 text-sm mt-2 font-medium">Minimal Top Up adalah Rp10.000</p>
              )}
              {amount && Number(amount) > 1000000 && (
                <p className="text-red-500 text-sm mt-2 font-medium">Maksimal Top Up adalah Rp1.000.000</p>
              )}
            </div>

            <button
              onClick={handleTopUpClick} 
              disabled={!amount || Number(amount) < 10000 || Number(amount) > 1000000}
              className={`w-full py-3 rounded-md font-semibold text-white transition ${
                !amount || Number(amount) < 10000 || Number(amount) > 1000000
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              Top Up
            </button>
          </div>

          <div className="w-full md:w-5/12 grid grid-cols-3 gap-4">
            {predefinedAmounts.map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val.toString())}
                className="py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:border-red-500 bg-white transition"
              >
                Rp{val.toLocaleString('id-ID')}
              </button>
            ))}
          </div>
        </section>

      </main>

      {(showConfirmModal || transactionStatus) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          {showConfirmModal && !transactionStatus && (
            <div className="bg-white rounded-xl p-8 w-[340px] text-center shadow-xl">
              <div className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
              </div>
              <p className="text-gray-600 text-[15px] mb-1">Anda yakin untuk Top Up sebesar</p>
              <p className="text-2xl font-bold mb-8">Rp{Number(amount).toLocaleString('id-ID')} ?</p>
              
              <div className="space-y-4">
                <button 
                  onClick={executeTopUp} 
                  disabled={isLoading}
                  className="font-bold text-red-500 block w-full hover:opacity-80 transition disabled:opacity-50"
                >
                  {isLoading ? 'Memproses...' : 'Ya, lanjutkan Top Up'}
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
              
              <p className="text-gray-600 text-[15px] mb-1">Top Up sebesar</p>
              <p className="text-2xl font-bold mb-1">Rp{submittedAmount.toLocaleString('id-ID')}</p>
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