import React from 'react';
import { Card, Avatar, Button, Input, Tabs, Row, Col } from 'antd';

const { TabPane } = Tabs;

const StaffProfile = () => {
  const staff = {
    id: 'NV12345',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123 456 789',
    gender: 'Nam',
    dob: '1990-01-01',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    role: 'Nhân viên bán hàng',
    avatar: 'https://i.pravatar.cc/150?img=3',
    username: 'nguyenvana',
  };

  return (
    <div
  style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f0f2f5',
    minHeight: '100vh',
    padding: '32px 16px',
  }}
>

 <div
      style={{ width: '100%', maxWidth: 1100, display: 'flex', justifyContent: 'center', alignItems:'center', overflow: 'hidden' ,maxWidth: '1100', width: '100%'}}
    >
      <Row gutter={32} style={{ padding: '20px' }}>
        {/* LEFT PROFILE CARD */}
        <Col xs={24} md={8}>
          <Card
            style={{
              borderRadius: 12,
              textAlign: 'center',
              paddingTop: 24,
            }}
          >
            <Avatar size={100} src={staff.avatar} />
            <h2 style={{ marginTop: 16 }}>{staff.name}</h2>
            <p>@{staff.username}</p>
            <Button type="primary" style={{ marginTop: 12, backgroundColor: '#ff4d4f' }}>
              Upload New Photo
            </Button>
            <p style={{ marginTop: 12, fontSize: 12 }}>
              Upload a new avatar. Larger image will be resized automatically.<br />
              Maximum upload size is <strong>1 MB</strong>
            </p>
            
          </Card>
        </Col>

        {/* RIGHT EDIT FORM */}
        <Col xs={24} md={16}>
          <Card style={{ borderRadius: 12 }}>
            <h2>Edit Profile</h2>
            <Tabs defaultActiveKey="1" style={{ marginTop: 24 }}>
              <TabPane tab="User Info" key="1">
                <Row gutter={16}>
                  <Col span={12}>
                    <label>Full Name</label>
                    <Input defaultValue="Nguyễn Văn A" />
                  </Col>
                  <Col span={12}>
                    <label>Username</label>
                    <Input defaultValue={staff.username} />
                  </Col>
                  <Col span={12} style={{ marginTop: 16 }}>
                    <label>Password</label>
                    <Input.Password defaultValue="12345678" />
                  </Col>
                  <Col span={12} style={{ marginTop: 16 }}>
                    <label>Confirm Password</label>
                    <Input.Password defaultValue="12345678" />
                  </Col>
                  <Col span={12} style={{ marginTop: 16 }}>
                    <label>Email Address</label>
                    <Input defaultValue={staff.email} />
                  </Col>
                  <Col span={12} style={{ marginTop: 16 }}>
                    <label>Confirm Email Address</label>
                    <Input defaultValue={staff.email} />
                  </Col>
                  
                </Row>
                <Button
                  type="primary"
                  style={{ marginTop: 24, backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
                >
                  Update info
                </Button>
              </TabPane>

              <TabPane tab="Billing Information" key="2">
                <p>Coming soon...</p>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </div>
</div>
   
    
  );
};

export default StaffProfile;
