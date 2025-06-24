import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CreateUser from './components/CreateUser';
import CreateGroup from './components/CreateGroup';
import AddExpense from './components/AddExpense';
import GroupBalances from './components/GroupBalances';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        
        <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-center sm:text-left">
              Splitwise Clone
            </h1>
          </div>
        </header>
        
        <nav className="bg-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-wrap gap-2 md:gap-4 justify-center sm:justify-start items-center">
              <Link 
                to="/"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm md:text-base flex-1 sm:flex-none text-center shadow hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Home
              </Link>
              <Link 
                to="/create-user"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm md:text-base flex-1 sm:flex-none text-center shadow hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Create User
              </Link>
              <Link 
                to="/create-group"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm md:text-base flex-1 sm:flex-none text-center shadow hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Create Group
              </Link>
              <Link 
                to="/add-expense"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm md:text-base flex-1 sm:flex-none text-center shadow hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Add Expense
              </Link>
              <Link 
                to="/balances"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm md:text-base flex-1 sm:flex-none text-center shadow hover:shadow-lg transform hover:-translate-y-0.5"
            >
              View Balances
            </Link>
          </div>
        </div>
        </nav>

      <main className="max-w-7xl mx-auto py-6 px-4">
        <Routes>
          <Route path="/" element={
            <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-3xl font-bold mb-4">Welcome to Splitwise Clone</h2>
              <p className="text-gray-600 mb-6">
                Track expenses, split bills, and settle up with friends and groups easily.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/create-user"
                  className="block p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-200"
                >
                  <h3 className="text-xl font-semibold mb-2">Create User</h3>
                  <p className="text-gray-600">Add new users to start splitting expenses</p>
                </Link>
                <Link
                  to="/create-group"
                  className="block p-6 bg-green-50 rounded-lg hover:bg-green-100 transition duration-200"
                >
                  <h3 className="text-xl font-semibold mb-2">Create Group</h3>
                  <p className="text-gray-600">Create groups to manage shared expenses</p>
                </Link>
                <Link
                  to="/add-expense"
                  className="block p-6 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition duration-200"
                >
                  <h3 className="text-xl font-semibold mb-2">Add Expense</h3>
                  <p className="text-gray-600">Record new expenses in your groups</p>
                </Link>
                <Link
                  to="/balances"
                  className="block p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition duration-200"
                >
                  <h3 className="text-xl font-semibold mb-2">View Balances</h3>
                  <p className="text-gray-600">Check who owes what in your groups</p>
                </Link>
              </div>
            </div>
          } />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/add-expense" element={<AddExpense />} />
          <Route path="/balances" element={<GroupBalances />} />
        </Routes>
      </main>
    </div>
    </Router>
  );
}

export default App;