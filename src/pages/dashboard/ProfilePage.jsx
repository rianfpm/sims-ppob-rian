import {useState, useEffect, useRef} from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import { logout } from '../../features/auth/authSlices'
import profilePhoto from '../../assets/icon/Profile Photo.png'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile')
        if (response.data.status === 0) {
          const fetchedData = response.data.data
          setProfile(fetchedData)
          setValue('first_name', fetchedData.first_name)
          setValue('last_name', fetchedData.last_name)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [setValue])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setMessage(null)
    try {
      const response = await api.put('/profile/update', data)
      if (response.data.status === 0) {
        setProfile(response.data.data)
        setIsEditing(false)
        setMessage({ type: 'success', text: response.data.message })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal update profil' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setMessage({ type: 'error', text: 'Format Image tidak sesuai' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await api.put('/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.data.status === 0) {
        setProfile(response.data.data)
        setMessage({ type: 'success', text: response.data.message })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal update foto profil' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-8 relative">
        {message && (
          <div className={`mb-6 p-4 rounded-md text-sm border-l-4 shadow-sm ${message.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="text-center mb-8">
          <div className="relative w-28 h-28 mx-auto mb-4">
            <img
              src={profile?.profile_image && profile.profile_image.includes('http') && !profile.profile_image.includes('null') ? profile.profile_image : profilePhoto}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 p-1.5 bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 flex items-center justify-center transform translate-x-1 translate-y-1 shadow-sm"
              title="Edit Profile Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.158 3.71 3.712 1.158-1.157a2.625 2.625 0 0 0 0-3.713ZM19.53 7.125l-3.71-3.712-11.45 11.45a3.75 3.75 0 0 0-1.026 1.74l-.991 3.967a.375.375 0 0 0 .456.456l3.966-.99a3.75 3.75 0 0 0 1.741-1.026l11.45-11.456Z" />
              </svg>
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            {profile ? `${profile.first_name} ${profile.last_name}` : 'Loading...'}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative flex items-center">
              <span className="absolute left-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                </svg>
              </span>
              <input
                type="email"
                readOnly
                className="w-full border border-gray-300 rounded-md pl-12 pr-4 py-3 outline-none text-sm bg-white text-gray-700 cursor-default"
                value={profile?.email || ''}
              />
            </div>
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Depan</label>
            <div className="relative flex items-center">
              <span className="absolute left-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </span>
              <input
                type="text"
                readOnly={!isEditing}
                className={`w-full border rounded-md pl-12 pr-4 py-3 outline-none text-sm 
                  ${errors.first_name ? 'border-red-500 text-red-500' : 'border-gray-300'} 
                  ${isEditing ? 'focus:border-red-500 bg-white text-gray-900' : 'bg-white text-gray-700 cursor-default'}`}
                {...register('first_name', { required: 'Nama Depan wajib diisi' })}
              />
            </div>
            {errors.first_name && <p className="text-red-500 text-xs text-right mt-1">{errors.first_name.message}</p>}
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Belakang</label>
            <div className="relative flex items-center">
              <span className="absolute left-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </span>
              <input
                type="text"
                readOnly={!isEditing}
                className={`w-full border rounded-md pl-12 pr-4 py-3 outline-none text-sm 
                  ${errors.last_name ? 'border-red-500 text-red-500' : 'border-gray-300'} 
                  ${isEditing ? 'focus:border-red-500 bg-white text-gray-900' : 'bg-white text-gray-700 cursor-default'}`}
                {...register('last_name', { required: 'Nama Belakang wajib diisi' })}
              />
            </div>
            {errors.last_name && <p className="text-red-500 text-xs text-right mt-1">{errors.last_name.message}</p>}
          </div>

          <div className="mt-8 space-y-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-500 text-white font-semibold py-3 rounded-md hover:bg-red-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(false);
                    if (profile) {
                      setValue('first_name', profile.first_name);
                      setValue('last_name', profile.last_name);
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full bg-white text-red-500 border border-red-500 font-semibold py-3 rounded-md hover:bg-red-50 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(true);
                  }}
                  className="w-full bg-red-500 text-white font-semibold py-3 rounded-md hover:bg-red-600 transition"
                >
                  Edit Profil
                </button>

                {/* Tombol Logout */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                  className="w-full bg-white text-red-500 border border-red-500 font-semibold py-3 rounded-md hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </form>
      </main>
    </div>
  )
}
