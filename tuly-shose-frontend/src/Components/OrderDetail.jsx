import React, { Component } from 'react';

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: '',
      noteError: '',
    };
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({ note: value });

    // Validation
    if (value.trim() === '') {
      this.setState({ noteError: 'Note is required' });
    } else if (value.length < 5) {
      this.setState({ noteError: 'Note must be at least 5 characters long' });
    } else {
      this.setState({ noteError: '' });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { note, noteError } = this.state;
    if (!noteError && note) {
      alert(`Adding note to order: ${note}`);
    }
  };

  render() {
    const { order } = this.props;
    const { note, noteError } = this.state;
    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl mb-4">Order Detail - #{order.id}</h1>
        <p className="mb-2">Customer: {order.customer}</p>
        <p className="mb-4">Item: {order.item}</p>
        <div>
          <h2 className="text-xl mb-2">Add Note to Order</h2>
          <div className="flex flex-col space-y-2">
            <textarea
              value={note}
              onChange={this.handleInputChange}
              placeholder="Add a note..."
              className="p-2 rounded bg-gray-700 text-white h-24"
            />
            {noteError && <p className="text-red-500 text-sm">{noteError}</p>}
            <button
              onClick={this.handleSubmit}
              className="bg-blue-500 p-2 rounded hover:bg-blue-600"
              disabled={!!noteError || !note}
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderDetail;