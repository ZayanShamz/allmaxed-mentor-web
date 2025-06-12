"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
// import { useRouter } from 'next/navigation';
import PasswordInput from './PasswordInput';
import * as Tooltip from '@radix-ui/react-tooltip';


export default function SignupForm() {

    // const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    const [submitted, setSubmitted] = useState(false);

    const [focusedField, setFocusedField] = useState<string | null>(null);

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePasswordChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            password: value
        }));
        
        if (errors.password) {
            setErrors(prev => ({
                ...prev,
                password: ''
            }));
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };
        let firstErrorField: string | null = null;

       
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
            if (!firstErrorField) firstErrorField = 'name';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
            isValid = false;
            if (!firstErrorField) firstErrorField = 'email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
            isValid = false;
            if (!firstErrorField) firstErrorField = 'phone';
        }

        // Check password
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
            if (!firstErrorField) firstErrorField = 'password';
        }

        setErrors(newErrors);
        return {isValid, firstErrorField};
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        const { isValid, firstErrorField } = validateForm();
        if (isValid) {
            console.log('Form data:', formData);
            // router.push('/signup/personalInfo');
        } else {
            if (firstErrorField === 'name' && nameRef.current) {
                nameRef.current.focus();
            } else if (firstErrorField === 'email' && emailRef.current) {
                emailRef.current.focus();
            } else if (firstErrorField === 'phone' && phoneRef.current) {
                phoneRef.current.focus();
            } else if (firstErrorField === 'password' && passwordRef.current) {
                passwordRef.current.focus();
            }
        }
    };

    return (
        <Tooltip.Provider>
            <div className="grid grid-rows-[1fr, auto] justify-items-center h-dvh">
                {/* row 1-3 (spanning 3) */}
                <div className="row-span-3 responsive-one grid grid-rows-[auto,1fr] items-center">
          
                    {/* Logo Section */}
                    <div className="h-full flex justify-center items-end overflow-hidden z-0">
                        <div className="w-[50%] sm:w-[50%] md:w-[50%] lg:w-[30%] max-w-[500px] mb-5 scale-75 h-auto aspect-[500/500] relative">
                            <Image
                                src="/images/login_logo.png"
                                alt="AllMax'd Logo"
                                className="absolute inset-0 w-full h-full object-contain"
                                fill priority
                            />
                        </div>
                    </div>

                    {/* Form Section */}
                    <form className="w-full grid grid-rows-5 items-center z-10" onSubmit={handleSubmit}>
                        
                        
                        <div className="flex justify-center items-center w-full">
                            <Tooltip.Root open={submitted && !!errors.name &&  focusedField === 'name'}>
                                <Tooltip.Trigger asChild>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Full Name"
                                        className={`form-input ${errors.name ? "border-red-500" : ""}`}
                                        value={formData.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        ref={nameRef}
                                    />
                                </Tooltip.Trigger>
                                <Tooltip.Portal>
                                    <Tooltip.Content 
                                        side="bottom"
                                        align="center"
                                        className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                                        sideOffset={5}
                                    >
                                        {errors.name}
                                        <Tooltip.Arrow className="fill-red-500" />
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </div>

                        <div className="flex justify-center items-center w-full">
                            <Tooltip.Root open={submitted && !!errors.email && focusedField === 'email'}>
                                <Tooltip.Trigger asChild>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        placeholder="Your Email"
                                        className={`form-input ${errors.email ? "border-red-500" : ""}`}
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
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

                        <div className="flex justify-center items-center w-full">
                            <Tooltip.Root open={submitted && !!errors.phone && focusedField === 'phone'}>
                                <Tooltip.Trigger asChild>
                                    <input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        placeholder="Your Phone No"
                                        className={`form-input ${errors.phone ? "border-red-500" : ""}`}
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('phone')}
                                        onBlur={() => setFocusedField(null)}
                                        ref={phoneRef}
                                    />
                                </Tooltip.Trigger>
                                
                                <Tooltip.Portal>
                                    <Tooltip.Content
                                        side="bottom"
                                        align="center"
                                        className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                                        sideOffset={5}
                                    >
                                        {errors.phone}
                                        <Tooltip.Arrow className="fill-red-500" />
                                    </Tooltip.Content>
                                </Tooltip.Portal>
                            </Tooltip.Root>
                        </div>


                        <PasswordInput
                            value={formData.password}
                            onChange={handlePasswordChange}
                            hasError={!!errors.password}
                            showTooltip={submitted && !!errors.password && focusedField === 'password'}
                            errorMessage={errors.password}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            ref={passwordRef}
                        />

                        <div className="flex justify-center items-center">
                            <button type="submit" className="form-button" >Sign Up</button>
                        </div>
                    </form>
                </div>
                {/* footer row */}
                <div className='responsive-one row-start-4 flex justify-center items-end pb-10'>
                    <span><span className="text-allcharcoal">Already a Mentor?</span> <Link href="/login" className="text-allpurple hover:underline focus:underline">Login</Link></span>
                </div>
            </div>
        </Tooltip.Provider>
    );
}