import React, { useState, ChangeEvent, useCallback, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "./Dropdown"; // Import your Dropdown components

interface Suggestion {
  key: string;
  label: string;
}

type AutocompleteProps = {
  suggestions: Suggestion[];
  onSelect: (key: string) => void;
};

const Autocomplete: React.FC<AutocompleteProps> = ({
  suggestions,
  onSelect,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(
    []
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);

      if (value) {
        const filtered = suggestions.filter((suggestion) =>
          suggestion.label.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
      } else {
        setFilteredSuggestions([]);
      }
    },
    [suggestions]
  );

  const handleSelectSuggestion = useCallback((suggestion: Suggestion) => {
    setInputValue(suggestion.label);
    setInputKey(suggestion.key);
    setFilteredSuggestions([]);
  }, []);

  useEffect(() => {
    onSelect(inputKey);
  }, [inputKey]);
  return (
    <Dropdown>
      {({ isOpen, toggle, close }) => (
        <>
          <DropdownTrigger>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={toggle}
              className="input input-bordered w-full"
              aria-autocomplete="list"
              aria-controls="autocomplete-list"
            />
            <input type="hidden" value={inputKey} />
          </DropdownTrigger>
          <DropdownMenu className="absolute mt-1 w-full flex flex-col gap-2 bg-white p-2 shadow-sm z-10">
            {filteredSuggestions.map((suggestion) => (
              <DropdownItem key={suggestion.key} className="dropdown-item">
                <button
                  type="button"
                  onClick={() => {
                    handleSelectSuggestion(suggestion);
                    close();
                  }}
                  data-accessible
                >
                  {suggestion.label}
                </button>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </>
      )}
    </Dropdown>
  );
};

export default Autocomplete;
