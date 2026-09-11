import React from "react";

/**
 * Simple, accessible RadioGroup wrapper.
 *
 * Props
 * -----
 * - defaultValue: string – the initially checked value
 * - onValueChange: (value: string) => void – called when selection changes
 * - className: string – optional Tailwind / custom classes
 *
 * Children should be <RadioGroupItem> elements (see below).
 */
export function RadioGroup({ defaultValue, onValueChange, className = "", children }) {
  const [value, setValue] = React.useState(defaultValue);

  // Keep local state in sync if parent changes defaultValue
  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setValue(newVal);
    if (onValueChange) onValueChange(newVal);
  };

  // Clone children to inject name, checked, and onChange props
  const cloned = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const childValue = child.props.value;
    return React.cloneElement(child, {
      name: "ocr-mode",
      checked: childValue === value,
      onChange: handleChange,
    });
  });

  return (
    <fieldset className={className} role="radiogroup">
      {cloned}
    </fieldset>
  );
}

/**
 * Individual radio button used inside RadioGroup.
 *
 * Props
 * -----
 * - value: string – value for this button
 * - name: string – injected by RadioGroup
 * - checked: boolean – injected by RadioGroup
 * - onChange: function – injected by RadioGroup
 */
export function RadioGroupItem({ value, name, checked, onChange }) {
  return (
    <input
      type="radio"
      value={value}
      name={name}
      checked={checked}
      onChange={onChange}
      className="hidden peer"
      id={`radio-${value}`}
    />
  );
}
