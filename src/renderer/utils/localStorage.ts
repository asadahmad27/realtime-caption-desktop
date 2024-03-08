export const setToken = (token: string) => {
    localStorage.setItem('access_token', token);
  };
  
  export const getToken = () => {
    const data = localStorage.getItem('access_token');
    if (data) {
      return data;
    }
  };
  
  export const removeToken = () => {
    localStorage.removeItem('access_token');
  };
  