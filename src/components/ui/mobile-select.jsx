"use client"

/**
 * MobileSelect — drop-in replacement for Select that renders a vaul bottom sheet
 * on small screens and the standard Radix popover on md+.
 *
 * Usage: identical to the normal Select / SelectTrigger / SelectContent / SelectItem.
 * Just import from this file instead of @/components/ui/select.
 */

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Drawer } from "vaul"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

// Hook: is the viewport below the md breakpoint (768px)?
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  )
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return isMobile
}

// Context to share open state between trigger and content
const MobileSelectCtx = React.createContext(null)

export function MobileSelect({ children, value, onValueChange, defaultValue, ...props }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  // Registry: value -> label string, populated by MobileSelectItem on render
  const labelRegistry = React.useRef({})

  if (!isMobile) {
    return (
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} defaultValue={defaultValue} {...props}>
        {children}
      </SelectPrimitive.Root>
    )
  }

  const registerLabel = (v, label) => { labelRegistry.current[v] = label }

  const handleValueChange = (v) => {
    onValueChange?.(v)
    setOpen(false)
  }

  const displayLabel = value ? (labelRegistry.current[value] || value) : null

  return (
    <MobileSelectCtx.Provider value={{ open, setOpen, value, displayLabel, onValueChange: handleValueChange, registerLabel }}>
      <SelectPrimitive.Root
        value={value}
        onValueChange={(v) => { onValueChange?.(v); setOpen(false) }}
        defaultValue={defaultValue}
        open={false}
        {...props}
      >
        {children}
      </SelectPrimitive.Root>
    </MobileSelectCtx.Provider>
  )
}

export const MobileSelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const ctx = React.useContext(MobileSelectCtx)

  if (!ctx) {
    // Desktop path — normal Radix trigger
    return (
      <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    )
  }

  // Mobile path — button that opens the vaul drawer
  // Extract placeholder from SelectValue child if present
  const placeholder = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === SelectPrimitive.Value
  )?.props?.placeholder

  return (
    <button
      ref={ref}
      type="button"
      disabled={props.disabled}
      className={cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => ctx.setOpen(true)}
    >
      <span className={cn("line-clamp-1", !ctx.value && "text-muted-foreground")}>
        {ctx.value ? (ctx.displayLabel || ctx.value) : (placeholder || "Select…")}
      </span>
      <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
    </button>
  )
})
MobileSelectTrigger.displayName = "MobileSelectTrigger"

export function MobileSelectContent({ children, label, ...props }) {
  const ctx = React.useContext(MobileSelectCtx)

  if (!ctx) {
    // Desktop path — normal Radix content
    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className={cn(
            "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=bottom]:translate-y-1"
          )}
          position="popper"
          {...props}
        >
          <SelectPrimitive.Viewport className="p-1 h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]">
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    )
  }

  // Mobile path — vaul Drawer bottom sheet
  return (
    <Drawer.Root open={ctx.open} onOpenChange={ctx.setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl border-t border-border/50 outline-none pb-[env(safe-area-inset-bottom)]">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>
          {label && (
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 pb-2 pt-1">{label}</p>
          )}
          <div className="overflow-y-auto max-h-[60vh] px-3 pb-4">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export function MobileSelectItem({ className, children, value, ...props }) {
  const ctx = React.useContext(MobileSelectCtx)

  if (!ctx) {
    // Desktop
    return (
      <SelectPrimitive.Item
        value={value}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        {...props}
      >
        <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
          <SelectPrimitive.ItemIndicator>
            <Check className="h-4 w-4" />
          </SelectPrimitive.ItemIndicator>
        </span>
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </SelectPrimitive.Item>
    )
  }

  // Mobile — tappable row in the bottom sheet
  const isSelected = ctx.value === value
  const labelText = typeof children === 'string' ? children : value
  // Register this item's label so the trigger can display it
  if (ctx.registerLabel) ctx.registerLabel(value, labelText)
  return (
    <button
      className={cn(
        "w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors",
        isSelected ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
        className
      )}
      onClick={() => ctx.onValueChange?.(value)}
    >
      <span>{children}</span>
      {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
    </button>
  )
}

export const MobileSelectValue = SelectPrimitive.Value
export const MobileSelectGroup = SelectPrimitive.Group
export const MobileSelectLabel = SelectPrimitive.Label
export const MobileSelectSeparator = SelectPrimitive.Separator

// Aliases for drop-in compatibility with @/components/ui/select import names
export const Select = MobileSelect
export const SelectTrigger = MobileSelectTrigger
export const SelectContent = MobileSelectContent
export const SelectItem = MobileSelectItem
export const SelectValue = MobileSelectValue
export const SelectGroup = MobileSelectGroup
export const SelectLabel = MobileSelectLabel
export const SelectSeparator = MobileSelectSeparator