'use client';
import { ReactNode, useEffect } from 'react';
import useApp from '../app-provider';
import { useRouter } from 'next/navigation';

export default function Layout({ children }: { children: ReactNode }) {
    const { user, isAuthenticated, loading } = useApp();
    const router = useRouter();
    // useEffect(() => {
    //     if (!isAuthenticated && !loading) router.push('/auth/login');
    // }, [loading, isAuthenticated]);
    return <div>{loading ? <p>Loading...</p> : children}</div>;
}
