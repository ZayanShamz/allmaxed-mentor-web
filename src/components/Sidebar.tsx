"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/context/authStore";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const { reset } = useAuthStore();
  const [show, setShow] = useState(isOpen);
  const pathname = usePathname();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    router.replace("/login");
    reset();
  };

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setShow(false), 280);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
      />

      {/* Sidebar */}

      <div
        className={`fixed top-0 right-0 h-dvh z-50 w-[80vw] bg-allcharcoal shadow-2xl transition-transform duration-300 ${
          isOpen ? "animate-slide-in-right" : "animate-slide-out-right"
        }`}
      >
        {/* Close Button */}
        <div className="absolute top-0 w-full flex justify-end p-4 bg-allcharcoal">
          <button onClick={onClose} className="p-2 rounded-full">
            <X size={24} className="text-allsnowflake fill-allsnowflake" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="p-4 h-full w-full flex justify-center items-center">
          <nav className="">
            <a
              href="/home"
              className={`block px-4 py-5 text-allsnowflake text-center border-b border-gray-600 ${
                pathname === "/home" ? "border-white" : "border-gray-600"
              }`}
              onClick={onClose}
              aria-current="page"
            >
              Home
            </a>
            <a
              href="/profile"
              className={`block px-4 py-5 text-allsnowflake text-center border-b border-gray-600 ${
                pathname === "/profile" ? "border-white" : "border-gray-600"
              }`}
              onClick={onClose}
            >
              Profile
            </a>
            <a
              href="/applied"
              className={`block px-4 py-5 text-allsnowflake text-center border-b ${
                pathname === "/applied" ? "border-white" : "border-gray-600"
              }`}
              onClick={onClose}
            >
              Applied
            </a>
            <a
              href="/colleges"
              className={`block px-4 py-5 text-allsnowflake text-center border-b border-gray-600 ${
                pathname === "/colleges" ? "border-white" : "border-gray-600"
              }`}
              onClick={onClose}
            >
              Colleges
            </a>
            <AlertDialog>
              <AlertDialogTrigger asChild className="w-full">
                <div className="block px-4 py-3 text-red-500 text-center">
                  Logout
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl">
                    Are you sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-md">
                    You will be logged out of your account. This action cannot
                    be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer text-white bg-red-500  hover:bg-red-600"
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                  >
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </nav>
        </div>
      </div>
    </>
  );
}
