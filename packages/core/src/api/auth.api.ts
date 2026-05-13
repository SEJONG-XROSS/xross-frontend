import { getApiClient } from './client';
import type { UserResponse, AuthResponse, UpdateProfileDto, FcmTokenResponse } from '../types/auth';

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const res = await getApiClient().post<AuthResponse>('/auth/login', { email, password });
  return res.data;
}

export async function getMeApi(): Promise<UserResponse> {
  const res = await getApiClient().get<UserResponse>('/auth/me');
  return res.data;
}

export async function updateProfileApi(data: UpdateProfileDto): Promise<UserResponse> {
  const res = await getApiClient().patch<UserResponse>('/auth/me', data);
  return res.data;
}

export async function registerFcmTokenApi(fcmToken: string): Promise<FcmTokenResponse> {
  const res = await getApiClient().post<FcmTokenResponse>('/auth/fcm-token', { fcmToken });
  return res.data;
}

export async function removeFcmTokenApi(fcmToken: string): Promise<FcmTokenResponse> {
  const res = await getApiClient().post<FcmTokenResponse>('/auth/fcm-token/remove', { fcmToken });
  return res.data;
}
