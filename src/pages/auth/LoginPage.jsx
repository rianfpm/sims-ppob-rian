import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { loginUser, resetState } from '../../features/auth/authSlices'

import logo from '../../assets/icon/logo.png'
import loginImage from '../../assets/img/Illustrasi Login.png'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    dispatch(loginUser(data))
  }

  useEffect(() => {
    if (isError) {
      setShowErrorAlert(true)
      // toast.error(message) // Opsional, kita gunakan alert custom di bawah
      dispatch(resetState())
    }

    if (isSuccess) {
      toast.success('Login berhasil')
      navigate('/home')
      dispatch(resetState())
    }
  }, [isError, isSuccess, message, navigate, dispatch])

  return (
    <div className="min-h-screen flex">
      <div className="relative w-full lg:w-1/2 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-10">
            <img src={logo} alt="logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold">SIMS PPOB</h1>
          </div>
          <h2 className="text-3xl font-bold text-center leading-snug mb-10">
            Masuk atau buat akun
            <br />
            untuk memulai
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <div className="relative flex items-center">
                <span className="absolute left-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-5 h-5 ${errors.email ? 'text-red-500' : 'text-gray-400'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="masukan email anda"
                  className={`
                    w-full border rounded-md pl-12 pr-4 py-3 outline-none text-sm
                    ${errors.email ? 'border-red-500 text-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500'}
                  `}
                  {...register('email', {
                    required: 'Email wajib diisi',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Format email tidak valid',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs text-right mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <div className="relative flex items-center">
                <span className="absolute left-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-5 h-5 ${errors.password ? 'text-red-500' : 'text-gray-400'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="masukan password anda"
                  className={`
                    w-full border rounded-md pl-12 pr-12 py-3 outline-none text-sm
                    ${errors.password ? 'border-red-500 text-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-red-500'}
                  `}
                  {...register('password', {
                    required: 'Password wajib diisi',
                    minLength: {
                      value: 8,
                      message: 'Password minimal 8 karakter',
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs text-right mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 transition text-white font-semibold py-3 rounded-md text-sm disabled:bg-red-300 mt-4"
            >
              {isLoading ? 'Loading...' : 'Masuk'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            belum punya akun? registrasi{' '}
            <Link to="/register" className="text-red-500 font-semibold">
              di sini
            </Link>
          </p>
        </div>
        {showErrorAlert && (
          <div className="absolute bottom-8 left-8 right-8 lg:left-24 lg:right-24 bg-red-50 text-red-500 px-4 py-3 rounded-md flex justify-between items-center text-sm shadow-sm border border-red-100">
            <span>{message || 'Username atau password salah'}</span>
            <button onClick={() => setShowErrorAlert(false)} className="text-red-500 font-bold ml-4">
              &times;
            </button>
          </div>
        )}
      </div>
      <div className="hidden lg:block lg:w-1/2">
        <img
          src={loginImage}
          alt="login"
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  )
}