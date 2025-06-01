import React, { Component } from 'react';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailError: '',
    };
  }

  handleInputChange = (e) => {
    const { value } = e.target;
    this.setState({ email: value });

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      this.setState({ emailError: 'Email is required' });
    } else if (!emailRegex.test(value)) {
      this.setState({ emailError: 'Please enter a valid email address' });
    } else {
      this.setState({ emailError: '' });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, emailError } = this.state;
    if (!emailError && email) {
      alert(`Updating profile with email: ${email}`);
    }
  };

  render() {
    const { email, emailError } = this.state;
    return (
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl mb-4">Profile</h1>
        <p className="mb-4">Staff profile details will be displayed here.</p>
        <div>
          <h2 className="text-xl mb-2">Update Email</h2>
          <div className="flex flex-col space-y-2">
            <input
              type="email"
              value={email}
              onChange={this.handleInputChange}
              placeholder="Enter your email..."
              className="p-2 rounded bg-gray-700 text-white"
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            <button
              onClick={this.handleSubmit}
              className="bg-blue-500 p-2 rounded hover:bg-blue-600"
              disabled={!!emailError || !email}
            >
              Update Email
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;