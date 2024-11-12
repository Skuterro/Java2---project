export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
  }
  
  export interface RegisterResponse {
    token: string;
    userId: string;
    email: string;
    username: string;
    balance: number;
    message: string;
  }