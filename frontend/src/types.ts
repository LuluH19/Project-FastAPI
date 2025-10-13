export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Contact {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  user_id: number;
}

export interface ContactCreate {
  nom: string;
  email: string;
  telephone: string;
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}
