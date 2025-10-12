import { createContext, useContext, useState, useEffect } from 'react'

// Saved Context
const SavedContext = createContext()

export const useSaved = () => {
  const context = useContext(SavedContext)
  if (!context) {
    throw new Error('useSaved must be used within AppProvider')
  }
  return context
}

// Compare Context
const CompareContext = createContext()

export const useCompare = () => {
  const context = useContext(CompareContext)
  if (!context) {
    throw new Error('useCompare must be used within AppProvider')
  }
  return context
}

// Combined Provider
export const AppProvider = ({ children }) => {
  // Saved State
  const [savedItems, setSavedItems] = useState(() => {
    const saved = localStorage.getItem('savedItems')
    return saved ? JSON.parse(saved) : []
  })

  // Compare State
  const [compareItems, setCompareItems] = useState(() => {
    const compare = localStorage.getItem('compareItems')
    return compare ? JSON.parse(compare) : []
  })

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems))
  }, [savedItems])

  useEffect(() => {
    localStorage.setItem('compareItems', JSON.stringify(compareItems))
  }, [compareItems])

  // Saved Functions
  const addToSaved = (item) => {
    setSavedItems(prev => {
      if (prev.some(saved => saved.id === item.id)) {
        return prev
      }
      return [...prev, { ...item, savedAt: new Date().toISOString() }]
    })
  }

  const removeFromSaved = (itemId) => {
    setSavedItems(prev => prev.filter(item => item.id !== itemId))
  }

  const isSaved = (itemId) => {
    return savedItems.some(item => item.id === itemId)
  }

  const toggleSaved = (item) => {
    if (isSaved(item.id)) {
      removeFromSaved(item.id)
    } else {
      addToSaved(item)
    }
  }

  // Compare Functions
  const addToCompare = (item) => {
    setCompareItems(prev => {
      if (prev.some(compare => compare.id === item.id)) {
        return prev
      }
      if (prev.length >= 4) {
        alert('Bạn chỉ có thể so sánh tối đa 4 sản phẩm')
        return prev
      }
      return [...prev, { ...item, addedAt: new Date().toISOString() }]
    })
  }

  const removeFromCompare = (itemId) => {
    setCompareItems(prev => prev.filter(item => item.id !== itemId))
  }

  const isInCompare = (itemId) => {
    return compareItems.some(item => item.id === itemId)
  }

  const toggleCompare = (item) => {
    if (isInCompare(item.id)) {
      removeFromCompare(item.id)
    } else {
      addToCompare(item)
    }
  }

  const clearCompare = () => {
    setCompareItems([])
  }

  const savedValue = {
    savedItems,
    addToSaved,
    removeFromSaved,
    isSaved,
    toggleSaved,
    savedCount: savedItems.length
  }

  const compareValue = {
    compareItems,
    addToCompare,
    removeFromCompare,
    isInCompare,
    toggleCompare,
    clearCompare,
    compareCount: compareItems.length
  }

  return (
    <SavedContext.Provider value={savedValue}>
      <CompareContext.Provider value={compareValue}>
        {children}
      </CompareContext.Provider>
    </SavedContext.Provider>
  )
}
