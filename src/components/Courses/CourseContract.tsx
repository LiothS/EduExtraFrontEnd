import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Contract, ContractsResponse, User } from '../../types/common';
import { config } from '../../common/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RootState } from '../../redux/UserStore';
import { useSelector } from 'react-redux';

interface CourseContractProps {
  courseUserId: number; // Add this prop to accept courseUserId
}

const CourseContract: React.FC<CourseContractProps> = ({ courseUserId }) => {
  const { id } = useParams<{ id: string }>();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteContractId, setDeleteContractId] = useState<number | null>(null);
  const [showSelectContractForm, setShowSelectContractForm] = useState(false);
  const [availableContracts, setAvailableContracts] = useState<Contract[]>([]);
  const globalUser = useSelector((state: RootState) => state.user.user);

  const hasRole = (user: User, roleName: string): boolean => {
    return user.roles.some((role) => role.roleName === roleName);
  };

  const isManager = globalUser && hasRole(globalUser, 'MANAGER');
  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.apiBaseUrl}/contracts/course/${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Đã xảy ra lỗi không xác định');
        return;
      }

      const data: Contract[] = await response.json();
      setContracts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định',
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchContracts();
  }, [id]);

  useEffect(() => {
    const fetchAvailableContracts = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/contracts/user/active/${courseUserId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || 'Đã xảy ra lỗi khi tải hợp đồng.');
          return;
        }
        const contractsData: ContractsResponse = await response.json();
        const data: Contract[] = contractsData.content;
        console.log('Available Contracts Data:', data); // Log the data
        if (Array.isArray(data)) {
          setAvailableContracts(data);
        } else {
          toast.error('Dữ liệu hợp đồng không hợp lệ.');
        }
      } catch (err) {
        toast.error('Đã xảy ra lỗi khi tải hợp đồng.');
      }
    };

    fetchAvailableContracts();
  }, [courseUserId]);

  const handleContractClick = (contract: Contract) => {
    setSelectedContract(contract);
  };

  const handleCloseModal = () => {
    setSelectedContract(null);
  };

  const handleDeleteClick = (contractId: number) => {
    setDeleteContractId(contractId);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/contracts/${deleteContractId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        setContracts((prevContracts) =>
          prevContracts.map((contract) =>
            contract.id === deleteContractId
              ? { ...contract, isTerminated: true }
              : contract,
          ),
        );
        toast.success('Hợp đồng đã bị huỷ thành công');
      } else {
        toast.error('Huỷ không thành công');
      }
    } catch (err) {
      toast.error('Huỷ không thành công');
    } finally {
      setShowConfirmDialog(false);
      setDeleteContractId(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDialog(false);
    setDeleteContractId(null);
  };

  const handleOpenSelectContractForm = () => {
    setShowSelectContractForm(true);
  };

  const handleCloseSelectContractForm = () => {
    setShowSelectContractForm(false);
  };

  const handleSelectContract = async (contractId: number) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/contracts/assign-to-course`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseId: id, // Assuming id here is the courseId
            contractId: contractId,
          }),
        },
      );

      if (response.ok) {
        toast.success('Liên kết thành công');
        await fetchContracts(); // Refresh the contracts list
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Liên kết hợp đồng không thành công');
      }
    } catch (err) {
      toast.error('Liên kết hợp đồng không thành công');
    } finally {
      handleCloseSelectContractForm();
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">Lỗi: {error}</div>;
  const popupStyle = {
    width: window.innerWidth < 1000 ? '100%' : '800px',
    height: window.innerHeight < 500 ? '100%' : '500px',
    maxWidth: '100%',
    maxHeight: '100%',
  };

  return (
    <div className="p-4">
      {/* Display contracts */}
      {contracts.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-4">Mã hợp đồng</th>
                  <th className="py-3 px-4">Loại hợp đồng</th>
                  <th className="py-3 px-4">Loại thu nhập</th>
                  <th className="py-3 px-4">Ngày bắt đầu</th>
                  <th className="py-3 px-4">Ngày hết hạn</th>
                  <th className="py-3 px-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className={`cursor-pointer hover:bg-gray-100 ${
                      contract.isTerminated ? 'line-through text-gray-500' : ''
                    }`}
                    onClick={() => handleContractClick(contract)}
                  >
                    <td className="py-3 px-4">HD-{contract.id}</td>
                    <td className="py-3 px-4">
                      {contract.contractType === 'LABOR'
                        ? 'Hợp đồng lao động'
                        : 'Khác'}
                    </td>
                    <td className="py-3 px-4">
                      {contract.earnType === 'SALARY' ? 'Lương' : 'Hoa hồng'}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(contract.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(contract.expiredDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {contract.isTerminated ? 'Đã kết thúc' : 'Đang hoạt động'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg border border-gray-300">
                <p className="text-lg font-semibold text-gray-800 mb-4">
                  Bạn có chắc chắn muốn xóa hợp đồng này không?
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={confirmDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
                  >
                    Có
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
                  >
                    Không
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal for Contract Details */}
          {selectedContract && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg border border-gray-300">
                <h2 className="text-xl font-bold mb-4">
                  {selectedContract.name}
                </h2>
                <p>
                  <strong>Loại hợp đồng:</strong>{' '}
                  {selectedContract.contractType}
                </p>
                <p>
                  <strong>Loại thu nhập:</strong> {selectedContract.earnType}
                </p>
                <p>
                  <strong>Ngày bắt đầu:</strong>{' '}
                  {new Date(selectedContract.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Ngày hết hạn:</strong>{' '}
                  {new Date(selectedContract.expiredDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{' '}
                  {selectedContract.isTerminated
                    ? 'Đã kết thúc'
                    : 'Đang hoạt động'}
                </p>
                <button
                  onClick={handleCloseModal}
                  className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>Không có hợp đồng nào.</p>
      )}
      {/* Form for selecting a contract */}
      {showSelectContractForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          style={{
            height: '100vh', // Ensure it takes up the full height of the viewport
            width: '100vw', // Ensure it takes up the full width of the viewport
            margin: 0, // Reset any margin
            padding: 0, // Reset any padding
            top: 0,
            left: 0,
            zIndex: 99999,
          }}
        >
          <div
            className="bg-white p-6 rounded-lg border border-gray-300 overflow-y-auto"
            style={{
              width: window.innerWidth < 1000 ? '90%' : '800px',
              maxHeight: '80vh', // Limit the height of the popup
            }}
          >
            <h2 className="text-xl font-bold mb-4">
              Chọn hợp đồng để liên kết
            </h2>
            <div className="space-y-4">
              {availableContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between p-2 border-b border-gray-300"
                >
                  <div className="flex flex-col w-full">
                    <p>
                      <strong>Mã:</strong> HD-{contract.id}
                    </p>
                    <p>
                      <strong>Loại hợp đồng:</strong>{' '}
                      {contract.contractType === 'LABOR'
                        ? 'Hợp đồng lao động'
                        : 'Khác'}
                    </p>
                    <p>
                      <strong>Loại thu nhập:</strong>{' '}
                      {contract.earnType === 'SALARY' ? 'Lương' : 'Hoa hồng'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectContract(contract.id)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark focus:outline-none"
                  >
                    Chọn
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleCloseSelectContractForm}
              className="mt-4 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {/* Floating Button */}
      {contracts.length === 0 && isManager && (
        <button
          onClick={handleOpenSelectContractForm}
          className="fixed bottom-8 right-8 rounded-full bg-primary text-white p-4 shadow-lg hover:bg-primary-dark focus:outline-none"
        >
          Liên kết hợp đồng
        </button>
      )}
      <ToastContainer />
    </div>
  );
};

export default CourseContract;
