import { createUser, getUserByEmail } from './db';
import { hashPassword, verifyPassword } from './crypto';

interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

const AUTH_KEY = 'giardino_auth_user';

export const signUp = async (email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return { user: null, error: 'Email già registrata' };
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser(email, passwordHash);
    
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    return { user: authUser, error: null };
  } catch (error) {
    return { user: null, error: 'Errore durante la registrazione' };
  }
};

export const signIn = async (email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { user: null, error: 'Credenziali non valide' };
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return { user: null, error: 'Credenziali non valide' };
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
    
    localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
    return { user: authUser, error: null };
  } catch (error) {
    return { user: null, error: 'Errore durante il login' };
  }
};

export const signOut = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = (): AuthUser | null => {
  const userStr = localStorage.getItem(AUTH_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
