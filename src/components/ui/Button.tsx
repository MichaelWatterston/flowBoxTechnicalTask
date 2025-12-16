interface ButtonProps {
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
}

export function Button({ 
  active, 
  onClick, 
  disabled, 
  children, 
  className = '',
  type = 'button',
  title,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed
}: ButtonProps) {
  return (
    <button 
      type={type}
      className={`${className} ${active ? 'active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
    >
      {children}
    </button>
  );
}
