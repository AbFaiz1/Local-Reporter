const AUTH_STORAGE_KEY = "local-reporter-auth";

export const getStoredAuth = () => {
  const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
};

export const saveAuthStorage = auth => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
};

export const clearAuthStorage = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getStoredToken = () => getStoredAuth()?.token || "";

export const getUserIdFromToken = token => {
  if (!token) {
    return "";
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || "";
  } catch {
    return "";
  }
};
