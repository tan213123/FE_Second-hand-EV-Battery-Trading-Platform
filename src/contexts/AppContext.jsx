import { createContext, useContext, useState, useEffect } from "react";

// Saved Context
const SavedContext = createContext();

export const useSaved = () => {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error("useSaved must be used within AppProvider");
  }
  return context;
};

// Compare Context
const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within AppProvider");
  }
  return context;
};

// Combined Provider
export const AppProvider = ({ children }) => {
  // Saved State
  const [savedItems, setSavedItems] = useState(() => {
    const saved = localStorage.getItem("savedItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Compare State
  const [compareItems, setCompareItems] = useState(() => {
    const compare = localStorage.getItem("compareItems");
    return compare ? JSON.parse(compare) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("savedItems", JSON.stringify(savedItems));
  }, [savedItems]);

  useEffect(() => {
    localStorage.setItem("compareItems", JSON.stringify(compareItems));
  }, [compareItems]);

  // Saved Functions
  const addToSaved = (item) => {
    setSavedItems((prev) => {
      if (prev.some((saved) => saved.id === item.id)) {
        return prev;
      }
      return [...prev, { ...item, savedAt: new Date().toISOString() }];
    });
  };

  const removeFromSaved = (itemId) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const isSaved = (itemId) => {
    return savedItems.some((item) => item.id === itemId);
  };

  const toggleSaved = (item) => {
    if (isSaved(item.id)) {
      removeFromSaved(item.id);
    } else {
      addToSaved(item);
    }
  };

  // Compare Functions
  const addToCompare = (item) => {
    const getItemType = (it) => {
      if (!it) return "unknown";
      if (it.compareType) return it.compareType;
      const cat = (it.category || "").toLowerCase();
      const articleType = it.articleType || it.type;

      if (
        cat.includes("ô tô") ||
        articleType === "CAR_ARTICLE" ||
        articleType === "car"
      ) {
        return "car";
      }
      if (
        cat.includes("xe máy") ||
        cat.includes("xe điện") ||
        articleType === "MOTOR_ARTICLE" ||
        articleType === "electric"
      ) {
        return "bike";
      }
      if (
        cat.includes("pin") ||
        articleType === "BATTERY_ARTICLE" ||
        articleType === "battery"
      ) {
        return "battery";
      }
      return "unknown";
    };

    const result = { success: false, message: "" };

    setCompareItems((prev) => {
      // Already in compare list
      if (prev.some((compare) => compare.id === item.id)) {
        result.success = false;
        result.message = "Sản phẩm đã có trong danh sách so sánh";
        return prev;
      }

      // Max 4 items
      if (prev.length >= 4) {
        alert("Bạn chỉ có thể so sánh tối đa 4 sản phẩm");
        result.success = false;
        result.message = "Bạn chỉ có thể so sánh tối đa 4 sản phẩm";
        return prev;
      }

      // Enforce same-type comparison when there are existing items
      if (prev.length > 0) {
        const currentType = getItemType(prev[0]);
        const newType = getItemType(item);

        if (
          currentType !== "unknown" &&
          newType !== "unknown" &&
          currentType !== newType
        ) {
          const typeNameMap = {
            car: "Ô tô điện",
            bike: "Xe máy/xe điện",
            battery: "Pin xe điện",
          };

          const currentLabel = typeNameMap[currentType] || "loại hiện tại";
          const newLabel = typeNameMap[newType] || "loại khác";

          alert(
            `Chỉ có thể so sánh các sản phẩm cùng loại.\n\nHiện tại bạn đang so sánh: ${currentLabel}.\nSản phẩm mới là: ${newLabel}.`
          );

          result.success = false;
          result.message = "Chỉ có thể so sánh các sản phẩm cùng loại";
          return prev;
        }
      }

      const newItem = { ...item, addedAt: new Date().toISOString() };
      result.success = true;
      result.message = "Đã thêm vào danh sách so sánh";
      return [...prev, newItem];
    });

    return result;
  };

  const removeFromCompare = (itemId) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const isInCompare = (itemId) => {
    return compareItems.some((item) => item.id === itemId);
  };

  const toggleCompare = (item) => {
    if (isInCompare(item.id)) {
      removeFromCompare(item.id);
    } else {
      addToCompare(item);
    }
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const savedValue = {
    savedItems,
    addToSaved,
    removeFromSaved,
    isSaved,
    toggleSaved,
    savedCount: savedItems.length,
  };

  const compareValue = {
    compareItems,
    addToCompare,
    removeFromCompare,
    isInCompare,
    toggleCompare,
    clearCompare,
    compareCount: compareItems.length,
  };

  return (
    <SavedContext.Provider value={savedValue}>
      <CompareContext.Provider value={compareValue}>
        {children}
      </CompareContext.Provider>
    </SavedContext.Provider>
  );
};
