// src/components/AccountManagement/PasswordManagement.tsx

import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { config } from '../../common/config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/UserStore';
import { User } from '../../types/common';

interface PasswordManagementProps {
  userId: number;
  username: string;
}

const PasswordManagement: React.FC<PasswordManagementProps> = ({
  userId,
  username,
}) => {
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const globalUser = useSelector((state: RootState) => state.user.user);

  const hasRole = (user: User, roleName: string): boolean => {
    return user.roles.some((role) => role.roleName === roleName);
  };
  const isAdmin = globalUser && hasRole(globalUser, 'ADMIN');
  const canEdit = isAdmin || userId === globalUser?.id;

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error('Mật khẩu mới không khớp');
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

      toast.success('Đổi mật khẩu thành công');
      setPasswordDialogOpen(false);
    } catch (error) {
      toast.error('Mật khẩu hiện tại không đúng');
    }
  };

  return (
    <div className="mb-6 border-t border-gray-200 pt-6">
      <h3 className="text-xl font-semibold text-gray-700">
        Thông tin tài khoản
      </h3>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-gray-600">Tài khoản: {username}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-gray-600">Mật khẩu: ***********</p>
        {canEdit && (
          <button
            onClick={() => setPasswordDialogOpen(true)}
            className="rounded bg-primary py-2 px-4 text-white hover:bg-primary-dark"
          >
            Đổi mật khẩu
          </button>
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

export default PasswordManagement;
