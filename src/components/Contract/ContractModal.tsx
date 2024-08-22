import React, { useEffect, useRef } from 'react';
import { Contract } from '../../types/common';

interface ContractModalProps {
  contract: Contract | null;
  onClose: () => void;
}

const ContractModal: React.FC<ContractModalProps> = ({ contract, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close the modal if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!contract) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-semibold mb-4">{contract.name}</h2>
        <div className="space-y-4">
          <div>
            <strong>Contract Type:</strong> {contract.contractType}
          </div>
          <div>
            <strong>Earn Type:</strong> {contract.earnType}
          </div>
          <div>
            <strong>Currency:</strong> {contract.currency}
          </div>
          <div>
            <strong>Amount:</strong> {contract.amount.toLocaleString()}
          </div>
          <div>
            <strong>Start Date:</strong>{' '}
            {new Date(contract.startDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Expiry Date:</strong>{' '}
            {new Date(contract.expiredDate).toLocaleDateString()}
          </div>
          <div>
            <strong>Terminated:</strong> {contract.isTerminated ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Courses:</strong>
            <ul className="list-disc pl-5 mt-2">
              {contract?.course?.map((course) => (
                <li key={course.id}>{course.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;
