import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Email" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('calls onChange handler when value changes', () => {
    const handleChange = jest.fn();
    render(<Input value="" onChange={handleChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(handleChange).toHaveBeenCalledWith('test');
  });

  it('displays error message', () => {
    render(<Input value="" onChange={() => {}} error="Invalid input" />);
    expect(screen.getByText('Invalid input')).toBeInTheDocument();
  });

  it('displays helper text', () => {
    render(<Input value="" onChange={() => {}} helperText="Helper text" />);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('renders required input', () => {
    render(<Input label="Required" value="" onChange={() => {}} required />);
    const input = screen.getByLabelText(/Required/i);
    expect(input).toBeRequired();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders disabled input', () => {
    render(<Input value="" onChange={() => {}} disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders with different types', () => {
    const { rerender } = render(<Input type="text" value="" onChange={() => {}} />);
    const textInput = screen.getByRole('textbox');
    expect(textInput).toBeInTheDocument();
    expect(textInput).toHaveAttribute('type', 'text');

    rerender(<Input type="email" value="" onChange={() => {}} />);
    const emailInput = screen.getByRole('textbox');
    expect(emailInput).toHaveAttribute('type', 'email');

    rerender(<Input type="password" value="" onChange={() => {}} />);
    const passwordInput = document.querySelector('input[type="password"]');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('renders placeholder text', () => {
    render(<Input value="" onChange={() => {}} placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });
});

