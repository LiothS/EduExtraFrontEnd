import React, { useEffect, useState } from 'react';
import { Contract, ContractsResponse } from '../../types/common';
import { config } from '../../common/config';
import ContractModal from './ContractModal';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
          throw new Error('Failed to fetch contracts');
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
    setSelectedContract(contract);
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
    navigate('/add-contract'); // Adjust the route as needed
  };

  return (
    <div className="tab-pane fade show active">
      {/* Display contracts */}
      {contractsLoading ? (
        <p>Loading contracts...</p>
      ) : contractsError ? (
        <p className="text-red-500">{contractsError}</p>
      ) : contracts.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Earn Type</th>
                  <th className="py-3 px-4">Start Date</th>
                  <th className="py-3 px-4">Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleContractClick(contract)}
                  >
                    <td className="py-3 px-4">{contract.name}</td>
                    <td className="py-3 px-4">{contract.contractType}</td>
                    <td className="py-3 px-4">{contract.earnType}</td>
                    <td className="py-3 px-4">
                      {new Date(contract.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(contract.expiredDate).toLocaleDateString()}
                    </td>
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
        <p>No contracts found.</p>
      )}

      {selectedContract && (
        <ContractModal contract={selectedContract} onClose={handleCloseModal} />
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleAddContract}
        className="fixed bottom-4 right-4 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-dark focus:outline-none"
      >
        + Thêm hợp đồng
      </button>
    </div>
  );
};

export default ContractsTab;
