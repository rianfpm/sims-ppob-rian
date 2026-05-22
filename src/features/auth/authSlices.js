import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
  token: localStorage.getItem('token') || null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const response = await api.post('/login', payload)

      const token = response.data.data.token

      localStorage.setItem('token', token)

      return token
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          'Login gagal'
      )
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, thunkAPI) => {
    try {
      const response = await api.post('/registration', payload)
      return response.data.message
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Registrasi gagal'
      )
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    resetState: (state) => {
      state.isLoading = false
      state.isError = false
      state.isSuccess = false
      state.message = ''
    },

    logout: (state) => {
      state.token = null

      localStorage.removeItem('token')
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.token = action.payload
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const {
  resetState,
  logout,
} = authSlice.actions

export default authSlice.reducer