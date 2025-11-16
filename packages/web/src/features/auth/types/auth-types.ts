export interface IUser {
  id: string;
  username: string;
  email: string;
}

export interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, pass: string) => Promise<void>;
  register: (username: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}
