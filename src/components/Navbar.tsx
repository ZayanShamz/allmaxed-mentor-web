"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/context/authStore";
import toast from "react-hot-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
import { Command, CommandItem } from "@/components/ui/command";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

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
          isScrolled ? "bg-allcharcoal p-3 " : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto px-5">
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
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Desktop Avatar & Profile/Logout Menu -+- Mobile View Menu */}
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className="hidden md:flex">
              <Popover open={avatarOpen} onOpenChange={setAvatarOpen}>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-0" align="end">
                  <Command className="py-5 px-3 bg-allsnowflake">
                    <CommandItem
                      asChild
                      className="w-full p-3 cursor-pointer hover:bg-white"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setAvatarOpen(false)}
                      >
                        <div className="text-[16px]">Profile</div>
                      </Link>
                    </CommandItem>
                    <hr className="border-1 border-gray-300" />
                    <CommandItem asChild>
                      <AlertDialog>
                        <AlertDialogTrigger
                          asChild
                          className="w-full p-3 cursor-pointer hover:bg-white"
                        >
                          <div className="text-[16px]">Logout</div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl">
                              Are you sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-md">
                              You will be logged out of your account. This
                              action cannot be undone.
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
                    </CommandItem>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* replace this avatar with the hamburger */}
            <div
              className="flex md:hidden cursor-pointer"
              onClick={handleMobileAvatarClick}
            >
              <Menu color="white" />
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
