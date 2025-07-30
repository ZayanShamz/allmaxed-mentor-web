"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/context/authStore";
import toast from "react-hot-toast";
import Sidebar from "./Sidebar";

// ui
import { Menu } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { reset } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    toast.success("Logged out successfully");
    router.replace("/login");
    reset();
  };

  const handleMobileAvatarClick = () => {
    setSidebarOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 1); // Change opacity after scrolling 100px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <nav
        className={`fixed w-full z-20 top-0 start-0 transition-all duration-300 ${
          isScrolled ? "bg-allcharcoal py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="w-full md:w-[75vw] flex flex-wrap items-center justify-between mx-auto px-4">
          {/* Logo */}
          <Link
            href="/home"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              src="/images/logo_text_white.png"
              alt="AllMax'd Logo"
              width={100}
              height={100}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Avatar & Profile/Logout Menu -+- Mobile View Menu */}
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className="hidden md:flex">
              <DropdownMenu
                modal={false}
                open={avatarOpen}
                onOpenChange={setAvatarOpen}
              >
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="cursor-pointer w-full">
                    <Link href="/profile" onClick={() => setAvatarOpen(false)}>
                      Profile
                    </Link>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>
                    <AlertDialog>
                      <AlertDialogTrigger asChild className="cursor-pointer">
                        <div>Logout</div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl">
                            Are you sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-md">
                            You will be logged out of your account. This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            className="cursor-pointer"
                            onClick={() => setAvatarOpen(false)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="cursor-pointer text-white bg-red-500  hover:bg-red-600"
                            onClick={() => {
                              handleLogout();
                              setAvatarOpen(false);
                            }}
                          >
                            Logout
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div
              className="flex md:hidden cursor-pointer"
              onClick={handleMobileAvatarClick}
            >
              <Menu color="white" size={32} />
            </div>
          </div>

          {/* Navigation Links */}

          <div
            className="md:flex max-md:hidden md:w-auto md:order-1 items-center justify-between"
            id="navbar-sticky"
          >
            <ul className="flex flex-row font-medium space-x-8 text-allsnowflake">
              <li>
                <Link
                  href="/home"
                  className={`block px-3  text-white ${
                    pathname === "/home" ? "snow-glow" : ""
                  }`}
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/applied"
                  className={`block px-3  text-white ${
                    pathname === "/applied" ? "snow-glow" : ""
                  }`}
                  aria-current="page"
                >
                  Applied
                </Link>
              </li>
              <li>
                <Link
                  href="/colleges"
                  className={`block px-3  text-white ${
                    pathname === "/colleges" ? "snow-glow" : ""
                  }`}
                  aria-current="page"
                >
                  Colleges
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
