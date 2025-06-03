import React, { Component } from 'react';

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      filterError: '',
    };
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({ filter: value });

    // Validation
    if (value.trim() === '') {
      this.setState({ filterError: 'Filter keyword is required' });
    } else {
      this.setState({ filterError: '' });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { filter, filterError } = this.state;
    if (!filterError && filter) {
      alert(`Filtering notifications by: ${filter}`);
    }
  };

  render() {
    const { filter, filterError } = this.state;
    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl mb-4">Notifications</h1>
        <p className="mb-4">List of notifications will be displayed here.</p>
        <div>
          <h2 className="text-xl mb-2">Filter Notifications</h2>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={filter}
              onChange={this.handleInputChange}
              placeholder="Filter by keyword..."
              className="p-2 rounded bg-gray-700 text-white"
            />
            {filterError && <p className="text-red-500 text-sm">{filterError}</p>}
            <button
              onClick={this.handleSubmit}
              className="bg-blue-500 p-2 rounded hover:bg-blue-600"
              disabled={!!filterError || !filter}
            >
              Filter
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Notifications;