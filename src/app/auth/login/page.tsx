'use client';

import {
    CodeResponse,
    GoogleCredentialResponse,
    NonOAuthError,
    TokenResponse,
} from '@/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import http from '@/lib/http';

export default function Page() {
    const [loginLoading, setLoginLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const btnContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const clientRef = useRef<any>();
    const [isLoadingPage, setIsLoadingPage] = useState(false);

    // useEffect(() => {
    //     const token = Cookies.get('token');
    //     if (token) {
    //         router.push('/');
    //     } else {
    //         setIsLoadingPage(false);
    //     }
    // }, []);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const res = await fetch('/api/auth', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 code: 'code',
    //             }),
    //         }).then((res) => res.json());

    //         console.log(res);
    //     };

    //     fetchData();
    // }, []);

    useEffect(() => {
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://accounts.google.com/gsi/client';
        scriptTag.defer = true;
        scriptTag.async = true;
        scriptTag.onload = () => {
            setScriptLoaded(true);
        };
        document.body.appendChild(scriptTag);

        return () => {
            document.body.removeChild(scriptTag);
        };
    }, []);

    useEffect(() => {
        if (scriptLoaded) {
            // const clientMethod = 'initTokenClient';

            // const client = window?.google?.accounts?.oauth2[clientMethod]({
            //     client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            //     scope: 'openid profile email',
            //     callback: (tokenResponse: TokenResponse) => {
            //         if (tokenResponse.error) {
            //             console.log('tokenResponse.error', tokenResponse.error);
            //         }
            //         onSignInCallback(tokenResponse);
            //     },
            //     error_callback: (nonOAuthError: NonOAuthError) => {
            //         onSignInErrorCallback(nonOAuthError);
            //     },
            // });

            // clientRef.current = client;
            window?.google?.accounts?.id?.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                callback: (credentialResponse: GoogleCredentialResponse) => {
                    if (!credentialResponse?.credential) {
                        console.log('error 2');
                        return onSignInErrorCallback();
                    }

                    const { credential, select_by } = credentialResponse;
                    onSignInCallback(credential);
                },
                error_callback: (nonOAuthError: NonOAuthError) => {
                    console.log(nonOAuthError);
                    // onSignInErrorCallback()
                },
                ux_mode: 'popup',
                hd: 'firegroup.io',
                context: 'signin',
            });

            window?.google?.accounts?.id?.renderButton(
                btnContainerRef.current!,
                {
                    type: 'standard',
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    shape: 'rectangular',
                    logo_alignment: 'center',
                    width: '10px',
                    locale: 'vi',
                }
            );
        }
    }, [scriptLoaded]);
    const onSignInCallback = async (response: string) => {
        if (response) {
            setLoginLoading(false);
            // console.log(response);
            Cookies.set('token', response, { expires: 60 });
            try {
                const res = await http.post('/auth/google/callback', {});

                console.log(res);
            } catch (error) {
                Cookies.remove('token');
            }
        }
    };

    const onSignInErrorCallback = () => {
        console.log('error');
        setLoginLoading(false);
    };

    const handleLogin = useCallback(() => {
        // if (clientRef.current) {
        //     console.log(clientRef.current);
        //     setLoginLoading(true);
        //     clientRef.current.requestAccessToken();
        // }

        setLoginLoading(true);
        btnContainerRef.current?.querySelector('div[role=button]')?.click();
    }, []);

    return (
        <div>
            {isLoadingPage ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {loginLoading && <div>Loading...</div>}
                    <div id="g-signin2" onClick={handleLogin}>
                        Login
                    </div>

                    <div
                        ref={btnContainerRef}
                        style={{ display: 'none' }}
                    ></div>
                    <button onClick={handleLogin}>Login google</button>
                </div>
            )}
        </div>
    );
}

declare global {
    interface Window {
        google: any;
    }
}
