import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'red' | 'yellow' | 'green';
}

const getVariantStyles = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'blue':
      return { backgroundColor: '#1d44dc' };
    case 'red':
      return { backgroundColor: '#FF5722' };
    case 'yellow':
      return { backgroundColor: '#ffc200' };
    case 'green':
    default:
      return { backgroundColor: '#4CAF50' };
  }
};

export const Button: React.FC<ButtonProps> = ({ children, variant = 'green', style, ...props }) => {
  const baseStyles: React.CSSProperties = {
    padding: '10px 15px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    marginRight: '10px',
  };

  const variantStyles = getVariantStyles(variant);

  return (
    <button style={{ ...baseStyles, ...variantStyles, ...style }} {...props}>
      {children}
    </button>
  );
};
