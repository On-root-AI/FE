import apiClient, { setApiAuthToken } from './client.js';

export async function signup({ email, password, nickname }) {
  await apiClient.post('/api/users/signup', { email, password, nickname });
}

export async function login({ email, password }) {
  const { data } = await apiClient.post('/api/users/login', {
    email,
    password,
  });

  if (data?.accessToken) {
    setApiAuthToken(data.accessToken);
  }

  return data;
}

export async function getMe() {
  const { data } = await apiClient.get('/api/users/me');
  return data;
}

export async function updateMe({ nickname }) {
  const { data } = await apiClient.patch('/api/users/me', { nickname });
  return data;
}

export async function deleteMe() {
  await apiClient.delete('/api/users/me');
  setApiAuthToken(null);
}

export function logout() {
  setApiAuthToken(null);
}
