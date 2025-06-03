import React from 'react'
import { Col, Input, Row, Button, Card } from "antd"
const { Meta } = Card

const ManagerHeader = () => {
  return (
    <>
      <Row>
        <Col span={3}>
          <div style={{padding: '10px'}}>
            <h2>Logo tuly shoe</h2>
          </div>
        </Col>
        <Col span={3}>
          <div style={{padding: '10px'}}>
            <h2>Dashboard</h2>
          </div>
        </Col>
        <Col span={3}>
          <div style={{padding: '10px'}}>
            <h2>products</h2>
          </div>
        </Col>
        <Col span={3}>
          <div style={{padding: '10px'}}>
            <h2>customers</h2>
          </div>
        </Col>
        <Col span={3}>
          <div style={{padding: '10px'}}>
            <h2>orders</h2>
          </div>
        </Col>
        <Col span={3}>
          <div style={{padding: '10px'}}>
            <h2>staff</h2>
          </div>
        </Col>
        <Col span={3}>
          <div style={{padding: '10px'}}>
            <h2>account</h2>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default ManagerHeader