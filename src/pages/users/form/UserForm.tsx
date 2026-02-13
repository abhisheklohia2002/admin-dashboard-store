import { Col, Input, Row, Form, Card } from "antd";
import React from "react";

export default function UserForm() {
  return (
    <Row>
      <Col span={24} title="Basic info">
        <Card>
          <Row gutter={"12px"}>
            <Col span={12}>
              <Form.Item label="First name" name="firstName">
                <Input placeholder="basic usage" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last name" name="lastName">
                <Input placeholder="basic usage" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
}
