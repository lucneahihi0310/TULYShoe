import React, { Component } from 'react';

class StaffDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      searchError: '',
    };
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({ search: value });

    // Validation
    if (value.trim() === '') {
      this.setState({ searchError: 'Search term is required' });
    } else if (value.length < 3) {
      this.setState({ searchError: 'Search term must be at least 3 characters long' });
    } else {
      this.setState({ searchError: '' });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { search, searchError } = this.state;
    if (!searchError && search) {
      alert(`Searching for: ${search}`);
    }
  };

  render() {
    const { search, searchError } = this.state;
    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl mb-4">Staff Dashboard</h1>
        <p className="mb-4">Welcome to the Staff Dashboard. Use the navigation bar above to access different sections.</p>
        <div>
          <h2 className="text-xl mb-2">Search Recent Activity</h2>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={search}
              onChange={this.handleInputChange}
              placeholder="Search activity..."
              className="p-2 rounded bg-gray-700 text-white"
            />
            {searchError && <p classBurName="text-red-500 text-sm">{searchError}</p>}
            <button
              onClick={this.handleSubmit}
              className="bg-blue-500 p-2 rounded hover:bg-blue-600"
              disabled={!!searchError || !search}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default StaffDashboard;