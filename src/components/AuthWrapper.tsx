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
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkDetailedAuth = async () => {
      // Define route categories
      const publicRoutes = ["/login", "/signup"];
      const semiPublicRoutes = [
        "/signup/personal-info",
        "/signup/professional-info",
        "/waiting",
        "/loading",
      ];
      const protectedRoutes = ["/home", "/applied", "/colleges", "/profile"];

      if (publicRoutes.includes(pathname)) {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // wait for hydration to complete
      if (!hydrated) {
        return;
      }

      // if (!userToken) {
      //   console.warn("AuthWrapper: No token");
      //   router.replace("/login");
      //   setIsChecking(false);
      //   return;
      // }

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
          router.replace("/login");
          setIsChecking(false);
          return;
        }

        // Update mentorData if user.mentor exists
        if (user.mentor) {
          setMentorData(user.mentor);
        }

        const status = user.status;

        // Handle different user statuses

        if (status === "approved") {
          // If Approved users land on loading page, redirect to /home
          if (pathname === "/loading") {
            router.replace("/home");
            setIsChecking(false);
            return;
          }

          // If approved user is on waiting page, show welcome message and redirect
          if (pathname === "/waiting") {
            toast.success("Welcome To Almax'd");
            router.replace("/home");
            setIsChecking(false);
            return;
          }

          // If approved user is on other semi-public routes, redirect to home
          if (semiPublicRoutes.includes(pathname)) {
            router.replace("/home");
            setIsChecking(false);
            return;
          }

          // Allow access to all other protected routes
          setIsAuthorized(true);

          // reject ::
        } else if (status === "rejected") {
          toast.error(
            "Your account has been rejected. Please contact support."
          );
          reset();
          router.replace("/login");
          setIsChecking(false);
          return;

          // pending/in-review users
        } else {
          // If user is on loading page, redirect based on status
          if (pathname === "/loading") {
            if (status === "pending") {
              toast("Fill out the remaining details to complete registration", {
                style: { background: "#333", color: "#fff" },
              });
              router.replace("/signup/personal-info");
            } else if (status === "in-review") {
              router.replace("/waiting");
            }
            setIsChecking(false);
            return;
          }

          // Allow access to public routes regardless of status
          if (publicRoutes.includes(pathname)) {
            setIsAuthorized(true);
          }

          // Unapproved users (pending/in-review status)
          if (semiPublicRoutes.includes(pathname)) {
            // Additional logic for pending users (shouldnt normally happen)
            if (status === "pending") {
              if (pathname === "/waiting") {
                router.replace("/signup/personal-info");
                setIsChecking(false);
                return;
              }
            } else if (status === "in-review") {
              // In-review users redirected to /waiting
              if (
                pathname === "/signup/personal-info" ||
                pathname === "/signup/professional-info"
              ) {
                router.replace("/waiting");
                setIsChecking(false);
                return;
              }
            }

            setIsAuthorized(true);
          } else {
            // Non-approved users trying to access protected routes
            const isProtectedRoute = protectedRoutes.some((route) =>
              pathname.startsWith(route)
            );

            if (isProtectedRoute) {
              toast.error("You're not Authorised");
              if (status === "pending") {
                router.replace("/signup/personal-info");
              } else {
                router.replace("/waiting");
              }
            } else {
              // For other routes, redirect based on status
              toast.error("Unauthorized access. Please complete your profile.");
              router.replace("/login");
            }
            setIsChecking(false);
            return;
          }
        }
      } catch (error: unknown) {
        console.error("Detailed auth validation failed:", error);

        if (error instanceof AxiosError && error.response?.status === 429) {
          toast.error("Too many requests. Please try again later.");
          setTimeout(() => {
            checkDetailedAuth();
          }, 10000); // Retry after 10 seconds
        } else {
          toast.error("Session expired. Please log in again.");
          reset();
          router.replace("/login");
        }
      }

      setIsChecking(false);
    };

    checkDetailedAuth();
  }, [userToken, hydrated, setMentorData, reset, router, pathname]);

  if (isChecking) {
    return <Loading />;
  }

  // Show loading if not authorized (shouldn't happen due to middleware)
  if (!isAuthorized) {
    return <Loading />;
  }

  return <>{children}</>;
}
