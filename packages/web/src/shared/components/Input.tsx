import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div style={{ marginBottom: '15px' }}>
      <label
        style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}
      >
        {label}
      </label>
      <input
        {...props}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box',
          fontSize: '16px',
        }}
      />
    </div>
  );
};
