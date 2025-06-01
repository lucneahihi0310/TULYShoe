import React, { Component } from 'react';

class UpdateStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderId: '',
      orderIdError: '',
      status: '',
      statusError: '',
    };
  }

  handleOrderIdChange = (e) => {
    const { value } = e.target;
    this.setState({ orderId: value });

    // Validation
    const numValue = parseInt(value);
    if (!value) {
      this.setState({ orderIdError: 'Order ID is required' });
    } else if (isNaN(numValue) || numValue <= 0) {
      this.setState({ orderIdError: 'Order ID must be a positive number' });
    } else {
      this.setState({ orderIdError: '' });
    }
  };

  handleStatusChange = (e) => {
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
    const { orderId, orderIdError, status, statusError } = this.state;
    if (!orderIdError && !statusError && orderId && status) {
      alert(`Updating Order #${orderId} to status: ${status}`);
    }
  };

  render() {
    const { orderId, orderIdError, status, statusError } = this.state;
    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl mb-4">Update Order Status</h1>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-sm mb-1">Order ID</label>
            <input
              type="number"
              value={orderId}
              onChange={this.handleOrderIdChange}
              placeholder="Enter Order ID..."
              className="p-2 rounded bg-gray-700 text-white w-full"
            />
            {orderIdError && <p className="text-red-500 text-sm">{orderIdError}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">New Status</label>
            <select
              value={status}
              onChange={this.handleStatusChange}
              className="p-2 rounded bg-gray-700 text-white w-full"
            >
              <option value="">Select status...</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
            {statusError && <p className="text-red-500 text-sm">{statusError}</p>}
          </div>
          <button
            onClick={this.handleSubmit}
            className="bg-blue-500 p-2 rounded hover:bg-blue-600"
            disabled={!!orderIdError || !!statusError || !orderId || !status}
          >
            Update Status
          </button>
        </div>
      </div>
    );
  }
}

export default UpdateStatus;