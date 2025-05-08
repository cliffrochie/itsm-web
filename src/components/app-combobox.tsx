"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

export type ComboBoxItemType = {
  value: string;
  label: string;
};

type ComboboxProps = {
  value?: string;
  label?: string;
  onSelect: (value: string, label?: string) => void;
  items: ComboBoxItemType[];
  searchPlaceholder?: string;
  noResultsMsg?: string;
  selectItemMsg?: string;
  className?: string;
  unselect?: boolean;
  unselectMsg?: string;
  onSearchChange?: (e: string) => void;
};

const popOverStyles = {
  width: "var(--radix-popover-trigger-width)",
};

export function AppComboBox({
  value,
  label,
  onSelect,
  items,
  searchPlaceholder = "Search item...",
  noResultsMsg = "No items found",
  selectItemMsg = "Select an item",
  className,
  unselect = false,
  unselectMsg = "None",
  onSearchChange,
}: ComboboxProps) {
  const [open, setOpenState] = React.useState(false);

  const handleOnSearchChange = useDebouncedCallback((e: string) => {
    onSearchChange?.(e);
  }, 300);

  function setOpen(isOpen: boolean) {
    if (!isOpen) handleOnSearchChange("");
    setOpenState(isOpen);
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {label || selectItemMsg}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={popOverStyles}
        className="p-0"
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={handleOnSearchChange}
          />
          <CommandList>
            <CommandEmpty>{noResultsMsg}</CommandEmpty>
            <CommandGroup>
              {unselect && (
                <CommandItem
                  key="unselect"
                  value=""
                  onSelect={() => {
                    onSelect("");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "" ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {unselectMsg}
                </CommandItem>
              )}
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  keywords={[item.label]}
                  onSelect={(value) => {
                    onSelect(value, item.label);
                    setOpen(false);
                  }}
                  disabled={value === item.value}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}