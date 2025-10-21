/**
 * Local Storage Service để lưu trữ tin đăng tạm thời
 * Sử dụng khi chưa có Backend API
 */

const STORAGE_KEYS = {
  MY_POSTS: 'eco_xe_my_posts',
  ALL_POSTS: 'eco_xe_all_posts'
}

export const localStorageService = {
  /**
   * Lưu tin đăng mới vào localStorage
   */
  savePost: (postData) => {
    try {
      const existingPosts = localStorageService.getMyPosts()
      const newPost = {
        id: 'post_' + Date.now(),
        ...postData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        views: 0,
        saves: 0
      }
      
      const updatedPosts = [newPost, ...existingPosts]
      localStorage.setItem(STORAGE_KEYS.MY_POSTS, JSON.stringify(updatedPosts))
      
      // Cũng lưu vào danh sách tất cả tin đăng
      const allPosts = localStorageService.getAllPosts()
      const updatedAllPosts = [newPost, ...allPosts]
      localStorage.setItem(STORAGE_KEYS.ALL_POSTS, JSON.stringify(updatedAllPosts))
      
      return newPost
    } catch (error) {
      console.error('Error saving post to localStorage:', error)
      return null
    }
  },

  /**
   * Lấy danh sách tin đăng của tôi
   */
  getMyPosts: () => {
    try {
      const posts = localStorage.getItem(STORAGE_KEYS.MY_POSTS)
      return posts ? JSON.parse(posts) : []
    } catch (error) {
      console.error('Error getting my posts from localStorage:', error)
      return []
    }
  },

  /**
   * Lấy tất cả tin đăng
   */
  getAllPosts: () => {
    try {
      const posts = localStorage.getItem(STORAGE_KEYS.ALL_POSTS)
      return posts ? JSON.parse(posts) : []
    } catch (error) {
      console.error('Error getting all posts from localStorage:', error)
      return []
    }
  },

  /**
   * Xóa tin đăng
   */
  deletePost: (postId) => {
    try {
      // Xóa từ my posts
      const myPosts = localStorageService.getMyPosts()
      const filteredMyPosts = myPosts.filter(post => post.id !== postId)
      localStorage.setItem(STORAGE_KEYS.MY_POSTS, JSON.stringify(filteredMyPosts))

      // Xóa từ all posts
      const allPosts = localStorageService.getAllPosts()
      const filteredAllPosts = allPosts.filter(post => post.id !== postId)
      localStorage.setItem(STORAGE_KEYS.ALL_POSTS, JSON.stringify(filteredAllPosts))

      return true
    } catch (error) {
      console.error('Error deleting post from localStorage:', error)
      return false
    }
  },

  /**
   * Cập nhật tin đăng
   */
  updatePost: (postId, updatedData) => {
    try {
      // Cập nhật my posts
      const myPosts = localStorageService.getMyPosts()
      const myPostIndex = myPosts.findIndex(post => post.id === postId)
      if (myPostIndex !== -1) {
        myPosts[myPostIndex] = {
          ...myPosts[myPostIndex],
          ...updatedData,
          updatedAt: new Date().toISOString()
        }
        localStorage.setItem(STORAGE_KEYS.MY_POSTS, JSON.stringify(myPosts))
      }

      // Cập nhật all posts
      const allPosts = localStorageService.getAllPosts()
      const allPostIndex = allPosts.findIndex(post => post.id === postId)
      if (allPostIndex !== -1) {
        allPosts[allPostIndex] = {
          ...allPosts[allPostIndex],
          ...updatedData,
          updatedAt: new Date().toISOString()
        }
        localStorage.setItem(STORAGE_KEYS.ALL_POSTS, JSON.stringify(allPosts))
      }

      return true
    } catch (error) {
      console.error('Error updating post in localStorage:', error)
      return false
    }
  },

  /**
   * Lấy tin đăng theo ID
   */
  getPostById: (postId) => {
    try {
      const allPosts = localStorageService.getAllPosts()
      return allPosts.find(post => post.id === postId) || null
    } catch (error) {
      console.error('Error getting post by ID from localStorage:', error)
      return null
    }
  },

  /**
   * Xóa tất cả dữ liệu
   */
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.MY_POSTS)
      localStorage.removeItem(STORAGE_KEYS.ALL_POSTS)
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  },

  /**
   * Lấy thống kê
   */
  getStats: () => {
    const myPosts = localStorageService.getMyPosts()
    const activePosts = myPosts.filter(post => post.status === 'active')
    
    return {
      totalPosts: myPosts.length,
      activePosts: activePosts.length,
      inactivePosts: myPosts.length - activePosts.length,
      totalViews: myPosts.reduce((sum, post) => sum + (post.views || 0), 0),
      totalSaves: myPosts.reduce((sum, post) => sum + (post.saves || 0), 0)
    }
  }
}

export default localStorageService