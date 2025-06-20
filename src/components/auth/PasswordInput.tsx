"use client";

import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface PasswordInputProps {
    value: string;
    onChange: (value: string) => void;
    hasError: boolean;
    showTooltip: boolean;
    errorMessage: string;
    onFocus?: () => void;
    onBlur?: () => void;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ value, onChange, hasError, showTooltip, errorMessage, onFocus, onBlur }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // Prevent default behavior (e.g., scrolling on Space)
                setShowPassword((prev) => !prev);
            }
        };

        return (
            <Tooltip.Root open={showTooltip}>
                <Tooltip.Trigger asChild>
                    <div className="flex justify-center items-center w-full relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="Password"
                            className={`form-input pr-10 ${hasError ? "border-red-500" : ""}`}
                            value={value}
                            onChange={handleChange}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            ref={ref}
                        />
                        <span
                            className="password-toggle"
                            role="button"
                            tabIndex={0}
                            onClick={() => setShowPassword(!showPassword)}
                            onKeyDown={handleKeyDown}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </span>
                    </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content 
                        side="bottom"
                        align="center"
                        className="bg-red-500 text-white px-3 rounded-lg shadow-lg z-50 animate-fade-in"
                        sideOffset={5}
                    >
                        {errorMessage}
                        <Tooltip.Arrow className="fill-red-500" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        );
    }
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;