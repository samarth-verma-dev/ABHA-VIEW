'use client';

import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { onAuthStateChanged, User, Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { auth, db } from '@/firebase';

type UserState = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserState | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserState => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider');
  }
  return context;
};

export const useAuth = (): Auth => {
  return auth;
};

export const useFirestore = (): Firestore => {
  return db;
};
