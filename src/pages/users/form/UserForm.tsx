import { Col, Input, Row, Form, Card, Select, Space } from "antd";
import React from "react";
import { allTenant } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import type { Tenants } from "../../../types";

const tenants = async () => {
  return await allTenant();
};

const tenantsDataSource = (data: Tenants[]) => {
  const items = data?.map((elem: Tenants) => {
    return {
      label: elem.name,
      value: elem.id,
    };
  });
  return items;
};
export default function UserForm() {
  const { data } = useQuery({
    queryKey: ["tenants"],
    queryFn: tenants,
    onSuccess: () => {},
    retry: false,
  });

  return (
    <Row>
      <Col span={24} title="Basic info">
        <Space
          direction="vertical"
          size={"middle"}
          style={{
            width: "100%",
          }}
        >
          <Card>
            <Row gutter={"12px"}>
              <Col span={12}>
                <Form.Item label="First name" name="firstName">
                  <Input size="large" placeholder="" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last name" name="lastName">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={"12px"}>
              <Col span={12}>
                <Form.Item label="Email" name="email">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Security info">
            <Row>
              <Col span={12}>
                <Form.Item label="Password" name="password">
                  <Input size="large" type="password" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Role">
            <Row gutter={"12px"}>
              <Col span={12}>
                <Form.Item label="role" name="role">
                  <Select
                    size="large"
                    placeholder="Select role"
                    allowClear
                    //   value={role}
                    //   onChange={(v) => onChangeRole(v)}
                    style={{ width: "100%" }}
                    options={[
                      { value: "admin", label: "Admin" },
                      { value: "manager", label: "Manager" },
                      { value: "customer", label: "Customer" },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="Tenant" name="tenantId">
                  <Select
                    size="large"
                    placeholder="Select Tenant"
                    allowClear
                    //   value={role}
                    //   onChange={(v) => onChangeRole(v)}
                    style={{ width: "100%" }}
                    options={tenantsDataSource(data?.data?.tenants ?? [])}
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
