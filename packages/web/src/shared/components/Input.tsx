import React, { useId } from 'react'; // 1. Імпортуємо useId

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => {
  // 2. Генеруємо унікальний ID для цієї пари
  const generatedId = useId();
  // Якщо id передали зовні (props.id), використовуємо його, інакше - згенерований
  const inputId = props.id || generatedId;

  return (
    <div style={{ marginBottom: '15px' }}>
      {/* 3. Додаємо htmlFor */}
      <label
        htmlFor={inputId}
        style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}
      >
        {label}
      </label>
      {/* 4. Додаємо id */}
      <input
        id={inputId}
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
