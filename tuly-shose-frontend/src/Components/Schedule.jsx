import React, { Component } from 'react';

class Schedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      dateError: '',
    };
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({ date: value });

    // Validation
    const today = new Date().toISOString().split('T')[0];
    if (!value) {
      this.setState({ dateError: 'Date is required' });
    } else if (value < today) {
      this.setState({ dateError: 'Date cannot be in the past' });
    } else {
      this.setState({ dateError: '' });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { date, dateError } = this.state;
    if (!dateError && date) {
      alert(`Viewing schedule for: ${date}`);
    }
  };

  render() {
    const { date, dateError } = this.state;
    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl mb-4">Work Schedule</h1>
        <p className="mb-4">Work schedule will be displayed here.</p>
        <div>
          <h2 className="text-xl mb-2">Select Date to View Schedule</h2>
          <div className="flex flex-col space-y-2">
            <input type="date" value={date} onChange={this.handleInputChange} className="p-2 rounded bg-gray-700 text-white" />
            {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
            <button
              onClick={this.handleSubmit}
              className="bg-blue-500 p-2 rounded hover:bg-blue-600"
              disabled={!!dateError || !date}
            >
              View Schedule
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Schedule;