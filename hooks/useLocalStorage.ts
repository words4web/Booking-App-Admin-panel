const useLocalStorage = () => {
  const isClient = typeof window !== "undefined";
  const getLocalStorage = (key: string) => {
    if (isClient) {
      return localStorage.getItem(key);
    }
    return null;
  };

  const setLocalStorage = (key: string, value: string) => {
    if (isClient) {
      return localStorage.setItem(key, value);
    }
    return null;
  };

  const removeLocalStorageItem = (key: string) => {
    if (isClient) {
      return localStorage.removeItem(key);
    }
    return null;
  };

  const clearLocalStorage = () => {
    if (isClient) {
      return localStorage.clear();
    }
    return null;
  };

  return {
    getLocalStorage,
    setLocalStorage,
    removeLocalStorageItem,
    clearLocalStorage,
  };
};

export default useLocalStorage;
