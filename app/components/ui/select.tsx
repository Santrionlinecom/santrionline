import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '~/lib/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange?: (value: string) => void;
}

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export interface SelectContentProps {
  children: React.ReactNode;
}

export interface SelectValueProps {
  placeholder?: string;
}

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  value: '',
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
});

const Select = ({
  children,
  value: controlledValue,
  onValueChange,
  defaultValue,
  name,
}: {
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  name?: string;
}) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue || controlledValue || '',
  );
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  React.useEffect(() => {
    // Sync when editing form changes defaultValue (mount new instance)
    if (defaultValue && !controlledValue) setUncontrolledValue(defaultValue);
  }, [defaultValue, controlledValue]);

  const handleValueChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setUncontrolledValue(newValue);
    }
    onValueChange?.(newValue);
    setOpen(false);
  };

  const currentValue = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  return (
    <SelectContext.Provider
      value={{ value: currentValue, onValueChange: handleValueChange, open, setOpen }}
    >
      <div className="relative" ref={wrapperRef}>
        {children}
        {name && <input type="hidden" name={name} value={currentValue} />}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext);

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    );
  },
);
SelectTrigger.displayName = 'SelectTrigger';

const SelectValue = ({ placeholder }: SelectValueProps) => {
  const { value } = React.useContext(SelectContext);
  return <span>{value || placeholder}</span>;
};

const SelectContent = ({ children }: SelectContentProps) => {
  const { open } = React.useContext(SelectContext);
  if (!open) return null;
  return (
    <div
      className="absolute top-full left-0 z-[1000] w-full mt-1 bg-popover border rounded-md shadow-md animate-in fade-in-0 zoom-in-95 origin-top overflow-hidden"
      role="listbox"
    >
      <div className="p-1 max-h-60 overflow-auto">{children}</div>
    </div>
  );
};

const SelectItem = ({ children, value }: { children: React.ReactNode; value: string }) => {
  const { onValueChange, value: currentValue } = React.useContext(SelectContext);
  const selected = currentValue === value;
  const handleActivate = () => onValueChange(value);
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActivate();
    }
  };
  return (
    <div
      role="option"
      aria-selected={selected}
      tabIndex={0}
      onKeyDown={handleKey}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none focus:ring-1 focus:ring-ring',
        selected
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-accent hover:text-accent-foreground',
      )}
      onClick={handleActivate}
    >
      {children}
      {selected && <span className="ml-auto text-xs opacity-70">✓</span>}
    </div>
  );
};

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
