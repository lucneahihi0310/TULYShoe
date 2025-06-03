import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { MdOutlineQuestionAnswer } from "react-icons/md"; 
import '../../../CSS/CustomerFeedback.css';

const CustomerFeedback = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const feedbackList = [
    { id: 1, customer: 'Nguyen Van A', description: 'Sản phẩm rất đẹp!', time: '2024-06-01', status: 'Responded' },
    { id: 2, customer: 'Tran Thi B', description: 'Giao hàng hơi chậm', time: '2024-06-02', status: 'Pending' },
    { id: 3, customer: 'Le Van C', description: 'Tư vấn nhiệt tình.', time: '2024-06-03', status: 'Responded' },
    { id: 4, customer: 'Pham Thi D', description: 'Chưa nhận được hàng!', time: '2024-06-04', status: 'Pending' },
  ];

  const filteredFeedbacks = feedbackList.filter(item => {
    const matchSearch = item.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleView = (feedback) => {
    setSelectedFeedback(feedback);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
  };

  return (
    
    <div className="feedback-container">
<h2 className="feedback-title">Customer Feedbacks</h2>
      

      <div className="feedback-filters">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Responded">Responded</option>
        </select>
      </div>

      <table className="feedback-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Description</th>
            <th>Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeedbacks.map(item => (
            <tr key={item.id} className={item.status === 'Pending' ? 'pending' : 'responded'}>
              <td>{item.id}</td>
              <td>{item.customer}</td>
              <td>{item.description.length > 50 ? item.description.slice(0, 50) + '...' : item.description}</td>
              <td>{item.time}</td>
              <td>
                <span className={`status-badge ${item.status.toLowerCase()}`}>{item.status}</span>
              </td>
              <td>
                <button style={{marginRight: '5px', borderRadius: '30px'}} onClick={() => handleView(item)} className="view-btn">
                  <FaEye /> View
                </button>
                <button style={{borderRadius: '30px'}}> <MdOutlineQuestionAnswer />Trả lời</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal hiển thị chi tiết */}
      {showModal && selectedFeedback && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Feedback Detail</h2>
            <p><strong>Customer:</strong> {selectedFeedback.customer}</p>
            <p><strong>Description:</strong> {selectedFeedback.description}</p>
            <p><strong>Time:</strong> {selectedFeedback.time}</p>
            <p><strong>Status:</strong> {selectedFeedback.status}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
    
  );
};

export default CustomerFeedback;
