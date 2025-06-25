"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import locations from "@/lib/locations.json";

export default function LocationSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Handle screen size detection
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const placeholder = isSmallScreen ? "Location" : "Select Location";

  return (
    <Select disabled>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <SelectTrigger
            aria-expanded={open}
            className="w-full px-5 py-3 bg-transparent border-none rounded-none text-allcharcoal text-md shadow-none hover:bg-purple-150 focus:ring-0 focus:border-none"
          >
            <SelectValue
              placeholder={
                value
                  ? locations.find((location) => location.value === value)
                      ?.label
                  : placeholder
              }
            />
          </SelectTrigger>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search location..." className="h-9" />
            <CommandList>
              <CommandEmpty>No location found.</CommandEmpty>
              <CommandGroup>
                {locations.map((location) => (
                  <CommandItem
                    key={location.value}
                    value={location.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {location.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === location.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Select>
  );
}
