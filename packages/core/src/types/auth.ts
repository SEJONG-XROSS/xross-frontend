export interface UserResponse {
  id: number;
  email: string;
  name: string | null;
  role: 'OWNER' | 'ADMIN';
  storeId: number;
  storeName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserResponse;
}

export interface UpdateProfileDto {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  storeName?: string;
  storeAddress?: string;
}

export interface FcmTokenResponse {
  success: boolean;
  message: string;
  fcmToken: string;
}
