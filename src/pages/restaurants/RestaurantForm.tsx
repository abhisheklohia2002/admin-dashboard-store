import { Card, Col, Row, Space, Form, Input } from "antd";
import React, { useState } from "react";
import type { ITenantForm } from "../../types";

interface ITenantProps {
  handleSubmitForm: (data: ITenantForm) => void;
}
export default function RestaurantForm({ handleSubmitForm }: ITenantProps) {
  const [tenantForm, setTenantForm] = useState<ITenantForm>({
    name: "",
    address: "",
  });
  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleForm = (e: any) => {
    const { name, value } = e.target;
    setTenantForm({
      ...tenantForm,
      [name]: value,
    });
    handleSubmitForm(tenantForm);
  };
  return (
    <Row>
      <Col span={24} title="Basic info">
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Card>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please input your Restaurant name",
                    },
                  ]}
                  label="Restaurant name"
                  name="name"
                >
                  <Input
                    onChange={handleForm}
                    value={tenantForm.name}
                    name="name"
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please input your address",
                    },
                  ]}
                  label="Address"
                  name="address"
                >
                  <Input
                    onChange={handleForm}
                    value={tenantForm.address}
                    name="address"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
}
