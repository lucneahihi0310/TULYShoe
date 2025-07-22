import { Container, Row, Col } from "react-bootstrap"
import Sidebar from "./Sidebar"
import DashboardContent from "./DashboardContent"

const StaffDashboard = () => {
  return (
    <Container fluid className="p-0">
      <Row className="g-0 min-vh-100">
        <Col xs={12} md={3} lg={2} className="bg-dark">
          <Sidebar />
        </Col>
        <Col xs={12} md={9} lg={10} className="bg-light">
          <DashboardContent />
        </Col>
      </Row>
    </Container>
  )
}

export default StaffDashboard
