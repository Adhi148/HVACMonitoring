import { mongoAPI } from './MongoAPIInstance';
import thingsboardAPI from './thingsboardAPI';

export const login = async (
  username: string,
  password: string
) => {
  const response = await thingsboardAPI.post<{ token: string }>('/auth/login', {
    username,
    password,
  });
  const token = response.data.token;
  localStorage.setItem('token', token);
  return token;
};
// Existing logout function
export const logout = async () => {
  await thingsboardAPI.post('/auth/logout');
  localStorage.removeItem('token');
};

// New API functions

// Change Password for Current User
export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const response = await thingsboardAPI.post('/auth/changePassword', {
    currentPassword,
    newPassword,
  });

  return response
};

// Get Current User
export const getCurrentUser = async () => {
  const response = await thingsboardAPI.get('/auth/user');
  return response;
};

// Check Activate User Token
export const checkActivateToken = async (
  activateToken: string
) => {
  const response = await thingsboardAPI.get('/noauth/activate', {
    params: { activateToken },
  });
  return response
};

// Activate User
export const activateUser = async (
  activateToken?: string,
  sendActivationMail?: boolean
) => {
  await thingsboardAPI.post('/noauth/activate', null, {
    params: { activateToken, sendActivationMail },
  });
};

// Reset Password
export const resetPassword = async (
  resetToken: string,
  password: string
) => {
  const response = await thingsboardAPI.post('/noauth/resetPassword', { resetToken: resetToken, password: password });
  return response;
};

// Check Password Reset Token
export const checkResetToken = async (resetToken: string) => {
  const response = await thingsboardAPI.get('/noauth/resetPassword', {
    params: { resetToken },
  });
  return response
};

// Request Reset Password Email
export const requestResetPasswordByEmail = async (
  email: string
) => {
  const response = await thingsboardAPI.post('/noauth/resetPasswordByEmail', { email });
  return response;
};

// Get User Password Policy


export const getUserPasswordPolicy = async () => {
  const response = await thingsboardAPI.get('/noauth/userPasswordPolicy');
  return response;
};

export const getResetToken = async (body: {
  email: string
}) => {
  console.log(body.email)
  const response = await mongoAPI.post('/postgres/getResetToken', body)
  // console.log(response)
  return response
}

export const setPassword = async(body: {
  user_id: string,
  password: string,
  enabled: boolean,
  activateToken: string | null
}) => {
  const response = await mongoAPI.post(`/postgres/createPassword`, body)
  return response
}
