import * as React from "react"
import { cn } from "~/lib/cn"

export interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  name?: string
  id?: string
  defaultChecked?: boolean
  className?: string
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, defaultChecked, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(defaultChecked || false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked
      setIsChecked(newChecked)
      onCheckedChange?.(newChecked)
    }

    const currentChecked = checked !== undefined ? checked : isChecked

    return (
      <label className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        currentChecked ? "bg-primary" : "bg-input",
        className
      )}>
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={currentChecked}
          onChange={handleChange}
          disabled={disabled}
          value={currentChecked ? "true" : "false"}
          {...props}
        />
        {/* Hidden input for form submission */}
        <input
          type="hidden"
          name={props.name}
          value={currentChecked ? "true" : "false"}
        />
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
            currentChecked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </label>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
