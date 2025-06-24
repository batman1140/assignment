import React, { useState, useEffect, useCallback } from 'react';
import { groupService } from '../services/api';
import toast from 'react-hot-toast';

const GroupBalances = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [balances, setBalances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await groupService.getGroups();
      setGroups(response.data);
    } catch (error) {
      toast.error('Error fetching groups');
    }
  };  const fetchBalances = useCallback(async () => {
    if (!selectedGroup) return;
    
    setIsLoading(true);
    try {
      const response = await groupService.getGroupBalances(selectedGroup);
      setBalances(response.data);
    } catch (error) {
      toast.error('Error fetching balances');
    } finally {
      setIsLoading(false);
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      fetchBalances();
    }
  }, [selectedGroup, fetchBalances]);

  if (groups.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">Group Balances</h2>
        <p className="text-gray-500 text-center">No groups available. Create a group first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Group Balances</h2>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Select Group
        </label>
        <select
          value={selectedGroup || ''}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="">Select a group</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : selectedGroup ? (
        balances.length === 0 ? (
          <p className="text-gray-500 text-center">No balances to show for this group.</p>
        ) : (
          <div className="space-y-4">
            {balances.map((balance, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{balance.user_name}</span>
                  <span className="text-gray-500">
                    {balance.amount > 0 ? 'gets back' : 'owes'}
                  </span>
                  <span className="font-medium">{balance.amount_with}</span>
                </div>
                <span className={`font-bold ${
                  balance.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${Math.abs(balance.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )
      ) : (
        <p className="text-gray-500 text-center">Select a group to view balances.</p>
      )}

      {selectedGroup && (
        <button
          onClick={fetchBalances}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Refresh Balances
        </button>
      )}
    </div>
  );
};

export default GroupBalances;
