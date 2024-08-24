// src/components/AccountManagement/AccountManagement.tsx

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { config } from '../../common/config';

interface BankAccount {
  id: number;
  accountNumber: string;
  owner: string;
  bankName: string;
  userId: number;
}

interface AccountManagementProps {
  userId: number;
  username: string;
}

const AccountManagement: React.FC<AccountManagementProps> = ({
  userId,
  username,
}) => {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          throw new Error('Failed to fetch bank accounts');
        }
        const data: BankAccount[] = await response.json();
        setBankAccounts(data);
      } catch (error) {
        toast.error('Failed to fetch bank accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchBankAccounts();
  }, [userId]);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/users/password/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      toast.success('Password changed successfully');
      setPasswordDialogOpen(false);
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleAddBankAccount = () => {
    // Implement functionality to add a new bank account
    toast.info('Functionality to add a new bank account will be implemented');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-700">Tài khoản</h3>
        <p className="mt-2 text-xl font-medium text-gray-600">{username}</p>
      </div>

      <div className="mb-6 border-t border-gray-200 pt-6">
        <h3 className="text-xl font-semibold text-gray-700">
          Tài khoản/Mật khẩu
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-gray-600">Mật khẩu: ***********</p>
          <button
            onClick={() => setPasswordDialogOpen(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Tài khoản ngân hàng
        </h3>
        <button
          onClick={handleAddBankAccount}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-200 mb-4"
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
                className="p-4 border rounded-md shadow-sm bg-gray-50"
              >
                <p className="text-gray-800">
                  <strong>Ngân hàng:</strong> {account.bankName}
                </p>
                <p className="text-gray-800">
                  <strong>Số tài khoản:</strong> {account.accountNumber}
                </p>
                <p className="text-gray-800">
                  <strong>Chủ tài khoản:</strong> {account.owner}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Change Password Dialog */}
      {passwordDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Đổi mật khẩu</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePasswordChange();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nhập lại mật khẩu mới
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setPasswordDialogOpen(false)}
                  className="bg-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
