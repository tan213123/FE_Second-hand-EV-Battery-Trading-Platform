import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { paymentService } from '../services/paymentService'

// Async thunks
export const fetchPayments = createAsyncThunk(
  'payment/fetchPayments',
  async (params, { rejectWithValue }) => {
    try {
      const result = await paymentService.getPayments(params)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchPaymentById = createAsyncThunk(
  'payment/fetchPaymentById',
  async (paymentId, { rejectWithValue }) => {
    try {
      const result = await paymentService.getPaymentById(paymentId)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchPaymentsByStatus = createAsyncThunk(
  'payment/fetchPaymentsByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const result = await paymentService.getPaymentsByStatus(status)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createPayment = createAsyncThunk(
  'payment/createPayment',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await paymentService.createPayment(payload)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createVnpayPaymentUrl = createAsyncThunk(
  'payment/createVnpayPaymentUrl',
  async (orderId, { rejectWithValue }) => {
    try {
      const result = await paymentService.createVnpayPaymentUrl(orderId)
      if (result.success) {
        return { orderId, url: result.data }
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const processPayment = createAsyncThunk(
  'payment/processPayment',
  async (paymentId, { rejectWithValue }) => {
    try {
      const result = await paymentService.processPayment(paymentId)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  payments: [],
  currentPayment: null,
  vnpayUrl: null,
  loading: false,
  error: null,
}

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null
    },
    clearVnpayUrl: (state) => {
      state.vnpayUrl = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false
        state.payments = action.payload
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch payment by ID
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPayment = action.payload
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch payments by status
      .addCase(fetchPaymentsByStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPaymentsByStatus.fulfilled, (state, action) => {
        state.loading = false
        state.payments = action.payload
      })
      .addCase(fetchPaymentsByStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create payment
      .addCase(createPayment.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false
        state.payments.push(action.payload)
        state.currentPayment = action.payload
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create VNPAY URL
      .addCase(createVnpayPaymentUrl.pending, (state) => {
        state.loading = true
        state.error = null
        state.vnpayUrl = null
      })
      .addCase(createVnpayPaymentUrl.fulfilled, (state, action) => {
        state.loading = false
        state.vnpayUrl = action.payload.url
      })
      .addCase(createVnpayPaymentUrl.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.vnpayUrl = null
      })
      // Process payment
      .addCase(processPayment.fulfilled, (state, action) => {
        const index = state.payments.findIndex(
          (payment) => payment.payId === action.payload.payId
        )
        if (index !== -1) {
          state.payments[index] = action.payload
        }
        if (state.currentPayment?.payId === action.payload.payId) {
          state.currentPayment = action.payload
        }
      })
  },
})

export const { clearError, clearCurrentPayment, clearVnpayUrl } =
  paymentSlice.actions
export default paymentSlice.reducer

