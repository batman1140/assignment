import React, { useState, useEffect } from 'react';
import { userService, groupService } from '../services/api';
import toast from 'react-hot-toast';

const CreateGroup = () => {
  const [formData, setFormData] = useState({
    name: '',
    members: []
  });
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Error fetching users');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const groupData = {
        name: formData.name,
        user_ids: selectedMembers // <-- FIXED: use user_ids to match backend
      };
      await groupService.createGroup(groupData);
      toast.success('Group created successfully!');
      setFormData({ name: '', members: [] });
      setSelectedMembers([]);
    } catch (error) {
      toast.error('Error creating group: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberToggle = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Group Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Members
          </label>
          <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
            {users.map(user => (
              <div key={user.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`user-${user.id}`}
                  checked={selectedMembers.includes(user.id)}
                  onChange={() => handleMemberToggle(user.id)}
                  className="mr-2"
                />
                <label htmlFor={`user-${user.id}`}>
                  {user.name} ({user.email})
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || selectedMembers.length < 2}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200
            ${(isLoading || selectedMembers.length < 2) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Creating...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
