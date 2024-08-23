import React, { useState, useEffect } from 'react';
import { config } from '../../common/config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AddContractModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddContractModal: React.FC<AddContractModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    contractType: 'LABOR',
    startDate: '',
    expiredDate: '',
    earnType: 'SALARY',
    currency: 'VND',
    amount: 0,
    per: 'MONTHLY',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/contracts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: 25, // Replace with actual userId if dynamic
          isTerminated: false,
        }),
      });

      if (response.ok) {
        toast.success('Tạo hợp đồng thành công', { autoClose: 500 });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 500); // Ensures `onSuccess` and `onClose` are called after the toast
      } else {
        toast.error('Failed to add contract', { autoClose: 500 });
      }
    } catch (err) {
      toast.error('Failed to add contract', { autoClose: 500 });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const updateModalHeight = () => {
      const header = document.querySelector('header');
      const headerHeight = header ? header.clientHeight : 0;
      const viewportHeight = window.innerHeight;

      // Adjust the modal height by subtracting header height and some extra margin
      const modalHeight = viewportHeight - headerHeight - 40; // 40px for margin/padding

      document.documentElement.style.setProperty(
        '--modal-max-height',
        `${modalHeight}px`,
      );
    };

    updateModalHeight();
    window.addEventListener('resize', updateModalHeight);

    return () => {
      window.removeEventListener('resize', updateModalHeight);
    };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-2xl w-full max-w-lg mx-auto modal-container">
        <h2 className="text-xl font-semibold mb-4">Add Contract</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="contractType"
              className="block text-sm font-medium mb-1"
            >
              Contract Type
            </label>
            <select
              id="contractType"
              name="contractType"
              value={formData.contractType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="LABOR">Labor</option>
              <option value="SERVICE">Service</option>
              {/* Add other options if needed */}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium mb-1"
            >
              Start Date
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="expiredDate"
              className="block text-sm font-medium mb-1"
            >
              Expiry Date
            </label>
            <input
              type="datetime-local"
              id="expiredDate"
              name="expiredDate"
              value={formData.expiredDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="earnType"
              className="block text-sm font-medium mb-1"
            >
              Earn Type
            </label>
            <select
              id="earnType"
              name="earnType"
              value={formData.earnType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="SALARY">Salary</option>
              <option value="COMMISSION">Commission</option>
              {/* Add other options if needed */}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="currency"
              className="block text-sm font-medium mb-1"
            >
              Currency
            </label>
            <input
              type="text"
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <div className="mb-4">
            <label htmlFor="per" className="block text-sm font-medium mb-1">
              Per
            </label>
            <select
              id="per"
              name="per"
              value={formData.per}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
              {/* Add other options if needed */}
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              {isSubmitting ? 'Adding...' : 'Add Contract'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContractModal;
