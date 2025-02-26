import { useAppwrite } from '@/hooks/useAppwrite';
import { getCurrentUser } from '@/lib/appwrite';
import { createContext, useContext } from 'react';

interface IUser {
    $id: string;
    name: string;
    email: string;
    avatar: string;
}

interface IGlobalContextType {
    isLoggedIn: boolean;
    user?: IUser | null;
    loading: boolean;
    refetch: () => void;

}

const GlobalContext = createContext<IGlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: user, loading, refetch } = useAppwrite({ fn: getCurrentUser });

    const isLoggedIn = !!user;


    return <GlobalContext.Provider value={{
        isLoggedIn,
        user,
        loading,
        refetch
    }}>{children}</GlobalContext.Provider>;
}

export const useGlobalContext = (): IGlobalContextType => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error("useGlobalContext must be used within GlobalProvider");

    }
    return context;
}

export default GlobalProvider