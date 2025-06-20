'use client';

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { useAuthStore } from '@/context/authStore';

export default function HomePage() {
    const { userToken, reset }  = useAuthStore();
    const router = useRouter();

    console.log('User Token in Home:', userToken);

    const handleLogout = () => {
        reset();
        router.push('/login');
    };

    return (
        <>
            <div className="container flex flex-col items-center justify-center mx-auto py-10 h-dvh">
                <h1 className="text-3xl font-bold">Welcome to Demo App!</h1>
                <p>You&apos;re successfully logged in</p>
                <Button variant="destructive" className="cursor-pointer my-5" onClick={handleLogout}>Logout</Button>
            </div>
        </>
  );
}