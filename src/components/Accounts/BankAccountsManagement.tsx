// src/components/AccountManagement/BankAccountsManagement.tsx

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { config } from '../../common/config';
import { FaTrash } from 'react-icons/fa'; // Import the delete icon

interface BankAccount {
  id: number;
  accountNumber: string;
  owner: string;
  bankName: string;
  userId: number;
}

interface BankAccountsManagementProps {
  userId: number;
}

const BankAccountsManagement: React.FC<BankAccountsManagementProps> = ({
  userId,
}) => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [addAccountDialogOpen, setAddAccountDialogOpen] = useState(false);
  const [deleteAccountId, setDeleteAccountId] = useState<number | null>(null);
  const [newAccount, setNewAccount] = useState({
    accountNumber: '',
    owner: '',
    bankName: '',
  });

  // Fetch bank accounts
  const fetchBankAccounts = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/users/${userId}/accounts`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        // Display the error message from the response
        toast.error(errorData.message || 'An unknown error occurred');
        return;
      }
      const data: BankAccount[] = await response.json();
      setBankAccounts(data);
    } catch (error) {
      toast.error('Failed to fetch bank accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankAccounts();
  }, [userId]);

  const handleAddBankAccount = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/users/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...newAccount,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add bank account');
      }

      toast.success('Thêm thành công');
      setAddAccountDialogOpen(false);
      setNewAccount({
        accountNumber: '',
        owner: '',
        bankName: '',
      });
      // Fetch updated list of bank accounts
      await fetchBankAccounts();
    } catch (error) {
      toast.error('Thêm thất bại');
    }
  };

  const handleDeleteBankAccount = async (accountId: number) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/users/accounts/${accountId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete bank account');
      }

      toast.success('Xoá thành công');
      setDeleteAccountId(null);
      // Fetch updated list of bank accounts
      await fetchBankAccounts();
    } catch (error) {
      toast.error('Xoá thất bại');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAccount((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Tài khoản ngân hàng
      </h3>
      <button
        onClick={() => setAddAccountDialogOpen(true)}
        className="rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark mb-4"
      >
        Thêm
      </button>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <ul className="space-y-4">
          {bankAccounts.map((account) => (
            <li
              key={account.id}
              className="p-4 border rounded-md shadow-sm bg-gray-50 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800">
                  <strong>Tên ngân hàng: </strong> {account.bankName}
                </p>
                <p className="text-gray-800">
                  <strong>Số tài khoản:</strong> {account.accountNumber}
                </p>
                <p className="text-gray-800">
                  <strong>Chủ tài khoản:</strong> {account.owner}
                </p>
              </div>
              <button
                onClick={() => setDeleteAccountId(account.id)}
                className="text-red-500 hover:text-red-700 transition duration-200"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add Bank Account Dialog */}
      {addAccountDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">
              Thêm tài khoản ngân hàng
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddBankAccount();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="accountNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Số tài khoản
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={newAccount.accountNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="owner"
                  className="block text-sm font-medium text-gray-700"
                >
                  Chủ tài khoản
                </label>
                <input
                  type="text"
                  id="owner"
                  name="owner"
                  value={newAccount.owner}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="bankName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tên ngân hàng
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={newAccount.bankName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddAccountDialogOpen(false)}
                  className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {/* Delete Confirmation Dialog */}
      {deleteAccountId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded-lg border border-gray-300">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Bạn có chắc chắn muốn xóa thẻ này không?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  if (deleteAccountId !== null) {
                    handleDeleteBankAccount(deleteAccountId);
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300"
              >
                Có
              </button>
              <button
                onClick={() => setDeleteAccountId(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-300"
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccountsManagement;
