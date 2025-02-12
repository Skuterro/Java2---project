export interface User {
  email: string;
  username: string;
  role: string;
  balance: number;
  authenticated?: boolean;
  imageId?: string;
  userId?: number;
  cases_opened?: number;
  profit?: number;
}