import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom'

import profilePhoto from '../../assets/icon/Profile Photo.png'

export default function TransactionHistoryPage() {
  const navigate = useNavigate()

  const [showSaldo, setShowSaldo] = useState(false)
  const [profile, setProfile] = useState(null)
  const [balance, setBalance] = useState(0)

  const [transactions, setTransactions] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 5

  useEffect(() => {
    fetchData()
    fetchHistory(0)
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

  const fetchHistory = async (currentOffset) => {
    try {
      const res = await api.get(`/transaction/history?offset=${currentOffset}&limit=${limit}`)
      if (res.data.status === 0) {
        const newRecords = res.data.data.records
        if (currentOffset === 0) {
          setTransactions(newRecords)
        } else {
          setTransactions(prev => [...prev, ...newRecords])
        }
        
        if (newRecords.length < limit) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    }
  }

  const handleShowMore = () => {
    const newOffset = offset + limit
    setOffset(newOffset)
    fetchHistory(newOffset)
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number).replace('Rp', 'Rp ')
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes} WIB`;
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
            <p className="text-gray-800 text-lg font-bold mb-6">Semua Transaksi</p>

            <div className="flex flex-col gap-4">
              {transactions.length === 0 ? (
                <p className="text-center text-gray-400 py-4">Maaf tidak ada histori transaksi saat ini</p>
              ) : (
                transactions.map((trx, index) => {
                  const isTopUp = trx.transaction_type === 'TOPUP'
                  const amountColor = isTopUp ? 'text-green-500' : 'text-red-500'
                  const amountPrefix = isTopUp ? '+' : '-'
                  
                  return (
                    <div key={index} className="flex justify-between items-center border border-gray-200 rounded-lg p-4">
                      <div>
                        <h3 className={`text-xl font-bold ${amountColor}`}>
                          {amountPrefix} Rp.{trx.total_amount.toLocaleString('id-ID')}
                        </h3>
                        <p className="text-gray-400 text-xs mt-2">{formatDate(trx.created_on)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs font-medium">{trx.description}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {hasMore && transactions.length > 0 && (
              <div className="text-center mt-6 p-4">
                <button 
                  onClick={handleShowMore}
                  className="text-red-500 font-semibold hover:text-red-600 transition"
                >
                  Show more
                </button>
              </div>
            )}
          </div>
        </section>


      </main>

    </div>
  )
}