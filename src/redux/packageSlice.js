import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { packageService } from '../services/packageService'

// Async thunks
export const fetchActivePackages = createAsyncThunk(
  'package/fetchActivePackages',
  async (_, { rejectWithValue }) => {
    try {
      const result = await packageService.getActivePackages()
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchPackages = createAsyncThunk(
  'package/fetchPackages',
  async (params, { rejectWithValue }) => {
    try {
      const result = await packageService.getPackages(params)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchPackageById = createAsyncThunk(
  'package/fetchPackageById',
  async (packageId, { rejectWithValue }) => {
    try {
      const result = await packageService.getPackageById(packageId)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createPackage = createAsyncThunk(
  'package/createPackage',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await packageService.createPackage(payload)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updatePackage = createAsyncThunk(
  'package/updatePackage',
  async ({ packageId, payload }, { rejectWithValue }) => {
    try {
      const result = await packageService.updatePackage(packageId, payload)
      if (result.success) {
        return result.data
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deletePackage = createAsyncThunk(
  'package/deletePackage',
  async (packageId, { rejectWithValue }) => {
    try {
      const result = await packageService.deletePackage(packageId)
      if (result.success) {
        return packageId
      }
      return rejectWithValue(result.error)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  packages: [],
  activePackages: [],
  currentPackage: null,
  loading: false,
  error: null,
}

const packageSlice = createSlice({
  name: 'package',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearCurrentPackage: (state) => {
      state.currentPackage = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch active packages
      .addCase(fetchActivePackages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchActivePackages.fulfilled, (state, action) => {
        state.loading = false
        state.activePackages = action.payload
      })
      .addCase(fetchActivePackages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch packages
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false
        state.packages = action.payload
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch package by ID
      .addCase(fetchPackageById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPackage = action.payload
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create package
      .addCase(createPackage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.loading = false
        state.packages.push(action.payload)
        state.activePackages.push(action.payload)
      })
      .addCase(createPackage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update package
      .addCase(updatePackage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.loading = false
        const index = state.packages.findIndex(
          (pkg) => pkg.packageId === action.payload.packageId
        )
        if (index !== -1) {
          state.packages[index] = action.payload
        }
        const activeIndex = state.activePackages.findIndex(
          (pkg) => pkg.packageId === action.payload.packageId
        )
        if (activeIndex !== -1) {
          state.activePackages[activeIndex] = action.payload
        }
        if (state.currentPackage?.packageId === action.payload.packageId) {
          state.currentPackage = action.payload
        }
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete package
      .addCase(deletePackage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.loading = false
        state.packages = state.packages.filter(
          (pkg) => pkg.packageId !== action.payload
        )
        state.activePackages = state.activePackages.filter(
          (pkg) => pkg.packageId !== action.payload
        )
        if (state.currentPackage?.packageId === action.payload) {
          state.currentPackage = null
        }
      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError, clearCurrentPackage } = packageSlice.actions
export default packageSlice.reducer

