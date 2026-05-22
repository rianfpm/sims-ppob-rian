import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  isError: false,
  message: '',
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const response = await api.post('/login', payload)

      localStorage.setItem('token', response.data.data.token)

      return response.data.data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login gagal'
      )
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null
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
        state.token = action.payload.token
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { logout } = authSlice.actions

export default authSlice.reducer