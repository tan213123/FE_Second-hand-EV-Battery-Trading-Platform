// API Test utilities for development
import { profileService, mockProfileData, mockUserStats, mockUserPosts, mockUserReviews } from '../services/profileService'

// Test API integration
export const testProfileAPI = async () => {
  console.log('🧪 Testing Profile API Integration...')
  
  try {
    // Test 1: Get Profile
    console.log('📋 Testing getProfile...')
    const profileResult = await profileService.getProfile()
    console.log('✅ getProfile result:', profileResult)
    
    // Test 2: Update Profile
    console.log('📝 Testing updateProfile...')
    const updateData = {
      ...mockProfileData,
      name: 'Nguyễn Văn Test',
      bio: 'Đã cập nhật thông tin test'
    }
    const updateResult = await profileService.updateProfile(updateData)
    console.log('✅ updateProfile result:', updateResult)
    
    // Test 3: Get User Stats
    console.log('📊 Testing getUserStats...')
    const statsResult = await profileService.getUserStats()
    console.log('✅ getUserStats result:', statsResult)
    
    // Test 4: Get User Posts
    console.log('📰 Testing getUserPosts...')
    const postsResult = await profileService.getUserPosts()
    console.log('✅ getUserPosts result:', postsResult)
    
    // Test 5: Get User Reviews
    console.log('⭐ Testing getUserReviews...')
    const reviewsResult = await profileService.getUserReviews()
    console.log('✅ getUserReviews result:', reviewsResult)
    
    console.log('🎉 All API tests completed successfully!')
    return true
    
  } catch (error) {
    console.error('❌ API test failed:', error)
    return false
  }
}

// Test mock data
export const testMockData = () => {
  console.log('🧪 Testing Mock Data...')
  
  console.log('📋 Mock Profile:', mockProfileData)
  console.log('📊 Mock Stats:', mockUserStats)
  console.log('📰 Mock Posts:', mockUserPosts)
  console.log('⭐ Mock Reviews:', mockUserReviews)
  
  console.log('✅ Mock data test completed!')
  return true
}

// Development helper to run all tests
export const runAllTests = async () => {
  console.log('🚀 Running all API tests...')
  
  // Test mock data first
  testMockData()
  
  // Test API integration
  const apiTestResult = await testProfileAPI()
  
  if (apiTestResult) {
    console.log('🎉 All tests passed! API integration is working correctly.')
  } else {
    console.log('⚠️ Some tests failed. Check the console for details.')
  }
  
  return apiTestResult
}

// Auto-run tests in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development mode detected. API tests available.')
  console.log('💡 To run tests manually, call: runAllTests()')
  
  // Make tests available globally in development
  if (typeof window !== 'undefined') {
    window.testProfileAPI = testProfileAPI
    window.testMockData = testMockData
    window.runAllTests = runAllTests
  }
}

export default {
  testProfileAPI,
  testMockData,
  runAllTests
}
