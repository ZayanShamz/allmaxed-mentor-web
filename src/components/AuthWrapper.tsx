"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/context/authStore";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Loading from "./Loading";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const userToken = useAuthStore((state) => state.userToken);
  const hydrated = useAuthStore((state) => state.hydrated);
  const setMentorData = useAuthStore((state) => state.setMentorData);
  const reset = useAuthStore((state) => state.reset);
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // public routes (accessible without userToken)
      const publicRoutes = ["/login", "/signup"];

      // semi-public routes (require userToken, accessible to non-rejected/non-approved)
      const semiPublicRoutes = [
        "/signup/personal-info",
        "/signup/professional-info",
        "/waiting",
      ];

      // Allow access to public routes regardless of token
      if (publicRoutes.includes(pathname)) {
        setIsChecking(false);
        return;
      }

      // wait for hydration to complete
      if (!hydrated) {
        return;
      }

      // Redirect to /login if no token for non-public routes
      if (!userToken) {
        router.push("/login");
        setIsChecking(false);
        return;
      }

      // Validate token and fetch user data for non-public routes
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
          {
            headers: { Authorization: `Bearer ${userToken}` },
          }
        );
        const user = response.data;

        // Ensure user is a mentor
        if (user.type !== "mentor") {
          toast.error("Unauthorized: Only mentors have access.");
          reset();
          router.push("/login");
          setIsChecking(false);
          return;
        }

        // Update mentorData if user.mentor exists
        if (user.mentor) {
          setMentorData(user.mentor);
        }

        // Redirect based on user.status
        const status = user.status;

        if (status === "approved") {
          // Approved users can access any page except semiPublicRoutes
          if (semiPublicRoutes.includes(pathname)) {
            if (pathname === "/waiting") {
              toast.success("Welcome To Almax'd");
              router.push("/home");
            } else {
              router.push("/home");
            }
          }
        } else if (status === "rejected") {
          toast.error(
            "Your account has been rejected. Please contact support."
          );
          reset();
          router.push("/login");
        } else {
          // Unapproved users (pending status) can only access semiPublicRoutes
          if (!semiPublicRoutes.includes(pathname)) {
            toast.error(
              "Unauthorized access. Please complete your profile by logging in."
            );
            router.push("/login");
          }
        }
      } catch (error: unknown) {
        console.error("Token validation failed:", error);
        if (error instanceof AxiosError && error.response?.status === 429) {
          toast.error("Too many requests. Please try again later.");
          setTimeout(() => {
            checkAuth();
          }, 10000); // Retry after 10 seconds
        } else {
          toast.error("Session expired. Please log in again.");
          reset();
          router.push("/login");
        }
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [userToken, hydrated, setMentorData, reset, router, pathname]);

  if (isChecking) {
    return <Loading />;
  }

  return <>{children}</>;
}
