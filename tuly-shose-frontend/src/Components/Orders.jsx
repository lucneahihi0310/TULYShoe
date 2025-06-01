import React, { Component } from 'react';

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [
        { id: 1, customer: 'John Doe', item: 'Laptop' },
        { id: 2, customer: 'Jane Smith', item: 'Phone' },
      ],
      filter: '',
      filterError: '',
    };
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({ filter: value });

    // Validation
    if (value.trim() === '') {
      this.setState({ filterError: 'Filter term is required' });
    } else if (value.length < 3) {
      this.setState({ filterError: 'Filter term must be at least 3 characters long' });
    } else {
      this.setState({ filterError: '' });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { filter, filterError } = this.state;
    if (!filterError && filter) {
      alert(`Filtering orders by: ${filter}`);
    }
  };

  render() {
    const { orders, filter, filterError } = this.state;
    const { navigateTo, setSelectedOrder } = this.props;
    const filteredOrders = orders.filter((order) =>
      order.customer.toLowerCase().includes(filter.toLowerCase())
    );

    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl mb-4">List Orders</h1>
        <div className="mb-4">
          <h2 className="text-xl mb-2">Filter Orders by Customer</h2>
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={filter}
              onChange={this.handleInputChange}
              placeholder="Filter by customer name..."
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
        <ul className="space-y-2">
          {filteredOrders.map((order) => (
            <li key={order.id} className="bg-gray-700 p-2 rounded">
              Order #{order.id} - {order.customer} - {order.item}
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    navigateTo('orderDetail');
                  }}
                  className="bg-green-500 p-1 rounded hover:bg-green-600"
                >
                  View Order Detail
                </button>
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    navigateTo('deliveryStatus');
                  }}
                  className="bg-yellow-500 p-1 rounded hover:bg-yellow-600"
                >
                  View Delivery Status
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Orders;