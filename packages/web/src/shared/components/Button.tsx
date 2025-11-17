import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const getVariantStyles = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'secondary':
      return { backgroundColor: '#2196F3' };
    case 'danger':
      return { backgroundColor: '#FF5722' };
    case 'primary':
    default:
      return { backgroundColor: '#4CAF50' };
  }
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    padding: '10px 15px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  };

  const variantStyles = getVariantStyles(variant);

  return (
    <button style={{ ...baseStyles, ...variantStyles, ...style }} {...props}>
      {children}
    </button>
  );
};
