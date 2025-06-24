import React, { useState, useEffect, useCallback } from 'react';
import { groupService } from '../services/api';
import toast from 'react-hot-toast';

const AddExpense = () => {
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    groupId: '',
    description: '',
    amount: '',
    paidBy: '',
    splitType: 'equal'
  });
  const [groupMembers, setGroupMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
  };  const fetchGroupDetails = useCallback(async () => {
    try {
      const response = await groupService.getGroup(formData.groupId);
      setGroupMembers(response.data.members);
    } catch (error) {
      toast.error('Error fetching group details');
    }
  }, [formData.groupId]);

  useEffect(() => {
    if (formData.groupId) {
      fetchGroupDetails();
    } else {
      setGroupMembers([]);
    }
  }, [formData.groupId, fetchGroupDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.groupId) {
      toast.error('Please select a group');
      return;
    }
    setIsLoading(true);
    try {
      let expenseData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        paid_by: parseInt(formData.paidBy),
        split_type: formData.splitType.toLowerCase(),
        splits: []
      };
      // If split type is percentage, collect splits from group members (not implemented here)
      // For now, keep splits empty for 'equal', as backend will handle it
      await groupService.addExpense(formData.groupId, expenseData);
      toast.success('Expense added successfully!');
      setFormData({
        groupId: '',
        description: '',
        amount: '',
        paidBy: '',
        splitType: 'equal'
      });
    } catch (error) {
      toast.error('Error adding expense: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Group
          </label>
          <select
            value={formData.groupId || ''}
            onChange={(e) => setFormData({...formData, groupId: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select a group</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Amount
          </label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Paid By
          </label>
          <select
            value={formData.paidBy}
            onChange={(e) => setFormData({...formData, paidBy: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
            disabled={!formData.groupId}
          >
            <option value="">Select a member</option>
            {groupMembers.map(member => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Split Type
          </label>
          <select
            value={formData.splitType}
            onChange={(e) => setFormData({...formData, splitType: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          >
            <option value="equal">Equal Split</option>
            <option value="percentage">Percentage Split</option>
            <option value="exact">Exact Amount</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.groupId}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200
            ${(isLoading || !formData.groupId) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
