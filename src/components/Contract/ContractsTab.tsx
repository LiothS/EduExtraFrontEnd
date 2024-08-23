import React, { useEffect, useState } from 'react';
import { Contract, ContractsResponse, User } from '../../types/common';
import { config } from '../../common/config';
import ContractModal from './ContractModal';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/UserStore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ContractsTabProps {
  userId: number;
}

const ContractsTab: React.FC<ContractsTabProps> = ({ userId }) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractsLoading, setContractsLoading] = useState(false);
  const [contractsError, setContractsError] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteContractId, setDeleteContractId] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();
  const globalUser = useSelector((state: RootState) => state.user.user);

  const hasRole = (user: User, roleName: string): boolean => {
    return user.roles.some((role) => role.roleName === roleName);
  };

  const isManager = hasRole(globalUser, 'MANAGER');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setContractsLoading(true);
        const response = await fetch(
          `${config.apiBaseUrl}/contracts/user/${userId}?page=${currentPage}&size=10&sort=createdDate,desc`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (!response.ok) {
          throw new Error('Không thể tải hợp đồng');
        }
        const contractsData: ContractsResponse = await response.json();
        setContracts(contractsData.content);
        setTotalPages(contractsData.totalPages); // Assuming the API returns totalPages
      } catch (err) {
        setContractsError((err as Error).message);
      } finally {
        setContractsLoading(false);
      }
    };

    fetchContracts();
  }, [userId, currentPage]);

  const handleContractClick = (contract: Contract) => {
    navigate(`/contract-detail/${contract.id}`);
  };

  const handleCloseModal = () => {
    setSelectedContract(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 rounded ${
            i === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };

  const handleAddContract = () => {
    navigate(`/add-contract/${userId}`); // Pass the userId as a parameter
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
        // Instead of removing, mark as terminated
        setContracts((prevContracts) =>
          prevContracts.map((contract) =>
            contract.id === deleteContractId
              ? { ...contract, isTerminated: true }
              : contract,
          ),
        );
        toast.success('Hợp đồng đã bị huỷ thành công', {
          autoClose: 500,
        });
      } else {
        toast.error('Huỷ không thành công', {
          autoClose: 500,
        });
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

  return (
    <div className="tab-pane fade show active">
      {/* Display contracts */}
      {contractsLoading ? (
        <p>Đang tải hợp đồng...</p>
      ) : contractsError ? (
        <p className="text-red-500">{contractsError}</p>
      ) : contracts.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-4">Loại hợp đồng</th>
                  <th className="py-3 px-4">Loại thu nhập</th>
                  <th className="py-3 px-4">Ngày bắt đầu</th>
                  <th className="py-3 px-4">Ngày hết hạn</th>
                  {isManager && <th className="py-3 px-4">Thao Tác</th>}
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
                    {isManager && (
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!contract.isTerminated) {
                              handleDeleteClick(contract.id);
                            }
                          }}
                          className={`px-4 py-2 rounded ${
                            contract.isTerminated
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                          disabled={contract.isTerminated}
                        >
                          Huỷ
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4">
            {renderPageNumbers()}
          </div>
        </>
      ) : (
        <p>Không có hợp đồng nào.</p>
      )}

      {selectedContract && (
        <ContractModal contract={selectedContract} onClose={handleCloseModal} />
      )}

      {showConfirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded-lg border border-gray-300">
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Bạn có chắc chắn muốn xóa hợp đồng này không?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300"
              >
                Có
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-300"
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}

      {isManager && (
        <button
          onClick={handleAddContract}
          className="fixed bottom-4 right-4 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-dark focus:outline-none"
        >
          + Thêm hợp đồng
        </button>
      )}

      <ToastContainer />
    </div>
  );
};

export default ContractsTab;
