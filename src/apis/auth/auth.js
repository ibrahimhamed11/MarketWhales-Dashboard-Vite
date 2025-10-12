import axios from '../axios';


const storage = {
    setItem: function(key, value) {
      localStorage.setItem(key, value);
    },
  
    getItem: function(key) {
      return localStorage.getItem(key);
    },
  
    removeItem: function(key) {
      localStorage.removeItem(key);
    }
  };



const login = async (email, password) => {
  try {
    const response = await axios.post('/user/login', { email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const userFn = async () => {
    const token = localStorage.getItem('tokenaa');
    if (token) {
      return token;
    } else {
      return null;
    }
  }
  

const isAdmin = async () => {
  const user = await userFn();
  return user && user.role === 'admin';
};

const logout = () => {
  storage.removeItem('token');
};

export { login, userFn, isAdmin, logout };
