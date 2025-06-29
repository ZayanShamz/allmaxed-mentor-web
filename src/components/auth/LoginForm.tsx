"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import PasswordInput from "./PasswordInput";
import { useAuthStore } from "@/context/authStore";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Button } from "../ui/button";

interface ErrorResponse {
  message?: string;
}

export default function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const {
    setSignupData,
    setMentorData,
    setUserData,
    setUserToken,
    reset,
    setApiPayload,
    userToken,
    mentorData,
  } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (userToken && mentorData?.status === "approved") {
      router.replace("/home");
    }
  }, [userToken, mentorData, router]);

  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const loginResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = loginResponse.data.token;
      //   console.log(token);

      if (!token) {
        throw new Error("Login failed: No token received");
      }

      const userResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return { token, user: userResponse.data };
    },
    onSuccess: ({ token, user }) => {
      const userType = user.type;
      const userStatus = user.status;

      const phone = user.phone;
      const username = user.name;
      const email = user.email;

      reset();
      setUserToken(token);

      if (userType === "mentor") {
        // redirect pending user to personal-info
        if (userStatus === "pending") {
          setSignupData({ username, email, phone });
          setApiPayload({ phone: phone });
          toast("Fill out the remaining details", {
            style: { background: "#333", color: "#fff" },
          });
          router.push("/signup/personal-info");
          // redirect in-review user to /waiting
        } else if (userStatus === "in-review") {
          toast.success("Approval in Review");
          router.push("/waiting");
          // set mentorData and userData, redirect to /home
        } else if (userStatus === "approved") {
          const { mentor, ...restUserData } = user;
          console.log("mentor :", mentor, "user : ", restUserData);
          setSignupData({ username, email, phone });
          setMentorData(mentor);
          setUserData(restUserData);
          router.replace("/home");
          toast.success("Login successful");
          // rejected :(
        } else if (userStatus === "rejected") {
          toast.error(
            "Your account has been rejected. Please contact support."
          );
        }
      } else {
        toast.error("Unauthorized Login. Only mentors can log in.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.status === 401) {
        toast.error("Invalid credentials");
      } else if (error.response) {
        toast.error(
          error.response.data.message || "Login failed. Please try again."
        );
      } else {
        toast.error(
          error.message || "Network error. Please check your connection."
        );
      }
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      password: value,
    }));

    if (errors.password) {
      setErrors((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    let firstErrorField: string | null = null;

    // Check email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "email";
    }

    // Check password
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
      if (!firstErrorField) firstErrorField = "password";
    }

    setErrors(newErrors);
    return { isValid, firstErrorField };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const { isValid, firstErrorField } = validateForm();
    if (isValid) {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    } else {
      if (firstErrorField === "email" && emailRef.current) {
        emailRef.current.focus();
        setFocusedField("email");
      } else if (firstErrorField === "password" && passwordRef.current) {
        passwordRef.current.focus();
        setFocusedField("password");
      }
    }
  };

  return (
    <Tooltip.Provider>
      <div className="flex flex-col items-center justify-center w-full h-dvh py-10">
        <div className="flex flex-col flex-1 w-full items-center justify-center">
          <div className="flex justify-center pb-5">
            <Image
              src="/images/login_logo.png"
              alt="AllMax'd Logo"
              className="object-contain h-auto w-40 md:w-48 lg:w-56 xl:w-64"
              width={256}
              height={256}
              priority
            />
          </div>
          <div className="responsive-one flex justify-center">
            <div className="min-w-[90%] sm:min-w-[60%] lg:min-w-[45%] flex flex-col items-start">
              <form className="w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col justify-center items-center w-full">
                  <Tooltip.Root
                    open={
                      submitted && !!errors.email && focusedField === "email"
                    }
                  >
                    <Tooltip.Trigger asChild>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email"
                        className={`form-input ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        ref={emailRef}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content
                        side="bottom"
                        align="center"
                        className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                        sideOffset={5}
                      >
                        {errors.email}
                        <Tooltip.Arrow className="fill-red-500" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </div>
                <PasswordInput
                  value={formData.password}
                  onChange={handlePasswordChange}
                  hasError={!!errors.password}
                  showTooltip={
                    submitted &&
                    !!errors.password &&
                    focusedField === "password"
                  }
                  errorMessage={errors.password}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  ref={passwordRef}
                />
                <div className="flex justify-center items-center py-5">
                  <Button
                    type="submit"
                    className="min-w-[45%] py-5 px-3 bg-allpurple text-allsnowflake text-lg border border-allcharcoal cursor-pointer transition duration-300 ease-in-out hover:bg-[#0022ff] hover:text-white"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Authenticating..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="w-full text-center">
          <span>
            <span className="text-allcharcoal">Not Yet a Mentor?</span>{" "}
            <Link
              href="/signup"
              className="text-allpurple hover:underline focus:underline"
            >
              Sign Up
            </Link>
          </span>
        </div>
      </div>
    </Tooltip.Provider>
  );
}
