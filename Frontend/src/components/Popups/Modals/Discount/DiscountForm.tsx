import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function DiscountForm({ action, code, addDiscount, editDiscount }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      code: code?.code || '',
      percentage: code?.percentage || 0,
      expires: code?.expires || '',
    }
  });
  
  const [expiryDate, setExpiryDate] = useState(code?.expires || '');

  useEffect(() => {
    // If editing, pre-fill form fields with provided `code` data
    if (code) {
      setValue('code', code.code);
      setValue('percentage', code.percentage);
      setValue('expires', code.expires);
    }
  }, [code, setValue]);

  const onSubmit = async (data) => {
    try {
        if (action === 'add') {
            await addDiscount(data);
        } else if (action === 'edit') {
            await editDiscount(code.code, data)
        }
    }
    catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Code Input */}
      <div>
        <label>Code:</label>
        <input
          type="text"
          {...register('code', {
            required: 'Code is required',
            maxLength: { value: 32, message: 'Max length is 32 characters' },
          })}
        />
        {errors.code && <p>{errors.code.message}</p>}
      </div>

      {/* Percentage Input */}
      <div>
        <label>Percentage:</label>
        <input
          type="number"
          {...register('percentage', {
            required: 'Percentage is required',
            min: { value: 0, message: 'Minimum is 0' },
            max: { value: 100, message: 'Maximum is 100' },
          })}
        />
        {errors.percentage && <p>{errors.percentage.message}</p>}
      </div>

      {/* Expiry Date Input */}
      <div>
        <label>Expires:</label>
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => {
            setExpiryDate(e.target.value);
            setValue('expires', e.target.value);
          }}
        />
        <button
          type="button"
          onClick={() => {
            setExpiryDate('');
            setValue('expires', '');
          }}
        >
          Clear Date
        </button>
      </div>

      {/* Submit Button */}
      <button type="submit">
        {action === 'edit' ? 'Edit Code' : 'Add Code'}
      </button>
    </form>
  );
};
