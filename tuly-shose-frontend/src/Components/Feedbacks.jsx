import React, { Component } from 'react';

class Feedbacks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: '',
      responseError: '',
    };
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({ response: value });

    // Validation
    if (value.trim() === '') {
      this.setState({ responseError: 'Response is required' });
    } else if (value.length < 10) {
      this.setState({ responseError: 'Response must be at least 10 characters long' });
    } else {
      this.setState({ responseError: '' });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { response, responseError } = this.state;
    if (!responseError && response) {
      alert(`Submitting response: ${response}`);
    }
  };

  render() {
    const { response, responseError } = this.state;
    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl mb-4">Customer Feedbacks</h1>
        <p className="mb-4">Customer feedbacks will be displayed here.</p>
        <div>
          <h2 className="text-xl mb-2">Respond to Feedback</h2>
          <div className="flex flex-col space-y-2">
            <textarea
              value={response}
              onChange={this.handleInputChange}
              placeholder="Write your response..."
              className="p-2 rounded bg-gray-700 text-white h-24"
            />
            {responseError && <p className="text-red-500 text-sm">{responseError}</p>}
            <button
              onClick={this.handleSubmit}
              className="bg-blue-500 p-2 rounded hover:bg-blue-600"
              disabled={!!responseError || !response}
            >
              Submit Response
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Feedbacks;