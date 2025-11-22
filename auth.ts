// Auth utilities for token management
export const auth = {
  setToken: (token: string) => localStorage.setItem('authToken', token),
  getToken: () => localStorage.getItem('authToken'),
  removeToken: () => localStorage.removeItem('authToken'),
  
  setUser: (user: any) => localStorage.setItem('currentUser', JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  removeUser: () => localStorage.removeItem('currentUser'),
  
  isLoggedIn: () => !!localStorage.getItem('authToken'),
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  }
};
