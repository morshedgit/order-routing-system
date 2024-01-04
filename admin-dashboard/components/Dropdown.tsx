import React, {
    useState,
    useCallback,
    KeyboardEvent,
    ReactNode,
    useEffect,
    useRef,
    createContext,
    useContext,
  } from 'react';
  // Dropdown Context to manage state and logic
  const DropdownContext = createContext({
    isOpen: false,
    toggle: () => {},
    close: () => {},
  });
  
  const useDropdownContext = () => useContext(DropdownContext);
  
  type DropdownProps = {
    children: (props: { isOpen: boolean; toggle: () => void; close: () => void }) => ReactNode;
  };
  
  // Main Dropdown Component
  export const Dropdown: React.FC<DropdownProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);
    const close = useCallback(() => setIsOpen(false), []);
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
  
      const handleFocusLoss = (event: FocusEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(document.activeElement)) {
          setIsOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('focusin', handleFocusLoss);
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('focusin', handleFocusLoss);
      };
    }, []);
  
    return (
      <DropdownContext.Provider value={{ isOpen, toggle, close }}>
        <div ref={dropdownRef} className="dropdown">
          {children({ isOpen, toggle, close })}
        </div>
      </DropdownContext.Provider>
    );
  };
  
  // Dropdown trigger
  export const DropdownTrigger: React.FC<{children:ReactNode}> = ({ children }) => {
    const { isOpen } = useDropdownContext();
    return (
      <div aria-haspopup="listbox" aria-expanded={isOpen} id="menu_trigger">
        {children}
      </div>
    );
  };
  
  // Dropdown Menu Component
  export const DropdownMenu: React.FC<{ className?: string, children:ReactNode }> = ({ children, className }) => {
    const { isOpen } = useDropdownContext();
  
    return isOpen ? (
      <ul className={`dropdown-menu ${className}`} role="listbox">
        {children}
      </ul>
    ) : null;
  };
  
  // Dropdown Item Component
  export const DropdownItem: React.FC<{ className?: string, children:ReactNode }> = ({ className, children }) => {
    const { close } = useDropdownContext();
  
    return (
      <li onKeyDown={(e) => handleKeyDown(e, close)} className={className}>
        {children}
      </li>
    );
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>, close: () => void) => {
    const dropdownMenu: HTMLElement | null = e.currentTarget.closest('.dropdown-menu');
  
    if (!dropdownMenu) return;
  
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault(); // Prevent the default action
  
      // Selector for all potential focusable elements
      const focusableSelectors = '[data-accessible]';
      const focusableItems = Array.from(dropdownMenu.querySelectorAll(focusableSelectors)).filter(
        (item) => !item.hasAttribute('disabled'),
      ) as HTMLElement[];
  
      const currentIndex = focusableItems.findIndex((item) => item === document.activeElement);
      let newIndex;
  
      if (e.key === 'ArrowUp') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : focusableItems.length - 1;
      } else if (e.key === 'ArrowDown') {
        newIndex = currentIndex < focusableItems.length - 1 ? currentIndex + 1 : 0;
      }
      if (newIndex) focusableItems[newIndex]?.focus();
    }
  
    if (e.key === 'Escape') {
      const parentDiv = dropdownMenu?.parentElement;
      const menuTrigger: HTMLElement | null | undefined = parentDiv?.querySelector(
        '#menu_trigger>[data-accessible]',
      );
      menuTrigger?.focus();
      close();
    }
  };