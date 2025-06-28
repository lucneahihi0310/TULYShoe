import React from "react";
import { Button, message } from "antd";

const TestMessage = () => {
  const showMsg = () => {
    message.success("Test thành công");
  };

  return <Button onClick={showMsg}>Test Toast</Button>;
};

export default TestMessage;
