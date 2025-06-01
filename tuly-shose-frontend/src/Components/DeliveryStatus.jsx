import React, { Component } from 'react';

class DeliveryStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: '',
      statusError: '',
    };
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({ status: value });

    // Validation
    if (!value) {
      this.setState({ statusError: 'Please select a status' });
    } else {
      this.setState({ statusError: '' });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { status, statusError } = this.state;
    if (!statusError && status) {
      alert(`Updating delivery status to: ${status}`);
    }
  };

  render() {
    const { order } = this.props;
    const { status, statusError } = this.state;
    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl mb-4">Delivery Status - Order #{order.id}</h1>
        <p className="mb-4">Current Status: Shipped</p>
        <div>
          <h2 className="text-xl mb-2">Update Delivery Status</h2>
          <div className="flex flex-col space-y-2">
            <select
              value={status}
              onChange={this.handleInputChange}
              className="p-2 rounded bg-gray-700 text-white"
            >
              <option value="">Select status...</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            {statusError && <p className="text-red-500 text-sm">{statusError}</p>}
            <button
              onClick={this.handleSubmit}
              className="bg-blue-500 p-2 rounded hover:bg-blue-600"
              disabled={!!statusError || !status}
            >
              Update Status
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default DeliveryStatus;