import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { orderService } from '../services/orderService'

// Async thunks
export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async (params, { rejectWithValue }) => {
    try {
      const result = await orderService.getOrders(params)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const result = await orderService.getOrderById(orderId)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchOrdersByMember = createAsyncThunk(
  'order/fetchOrdersByMember',
  async (memberId, { rejectWithValue }) => {
    try {
      const result = await orderService.getOrdersByMember(memberId)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchOrdersByStatus = createAsyncThunk(
  'order/fetchOrdersByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const result = await orderService.getOrdersByStatus(status)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await orderService.createOrder(payload)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateOrder = createAsyncThunk(
  'order/updateOrder',
  async ({ orderId, payload }, { rejectWithValue }) => {
    try {
      const result = await orderService.updateOrder(orderId, payload)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const confirmOrder = createAsyncThunk(
  'order/confirmOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const result = await orderService.confirmOrder(orderId)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const result = await orderService.cancelOrder(orderId)
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
  orders: [],
  currentOrder: null,
  memberOrders: [],
  loading: false,
  error: null,
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
    clearMemberOrders: (state) => {
      state.memberOrders = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch orders by member
      .addCase(fetchOrdersByMember.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrdersByMember.fulfilled, (state, action) => {
        state.loading = false
        state.memberOrders = action.payload
      })
      .addCase(fetchOrdersByMember.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch orders by status
      .addCase(fetchOrdersByStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOrdersByStatus.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchOrdersByStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.orders.push(action.payload)
        state.currentOrder = action.payload
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update order
      .addCase(updateOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false
        const index = state.orders.findIndex(
          (order) => order.orderId === action.payload.orderId
        )
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.currentOrder?.orderId === action.payload.orderId) {
          state.currentOrder = action.payload
        }
        const memberIndex = state.memberOrders.findIndex(
          (order) => order.orderId === action.payload.orderId
        )
        if (memberIndex !== -1) {
          state.memberOrders[memberIndex] = action.payload
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Confirm order
      .addCase(confirmOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order.orderId === action.payload.orderId
        )
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.currentOrder?.orderId === action.payload.orderId) {
          state.currentOrder = action.payload
        }
      })
      // Cancel order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order.orderId === action.payload.orderId
        )
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.currentOrder?.orderId === action.payload.orderId) {
          state.currentOrder = action.payload
        }
      })
  },
})

export const { clearError, clearCurrentOrder, clearMemberOrders } =
  orderSlice.actions
export default orderSlice.reducer

