import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, Input, Row, Select } from "antd";
import React, { useState } from "react";

type Role = "admin" | "manager" | "customer";
type Status = "ban" | "active";
interface UserSearchProps {
  handleSearch: (value: string) => void;
  handleRole: (value: string) => void;
  handleStatus: (value: string) => void;
}
export default function UserFilter({
  handleSearch,
  handleRole,
  handleStatus,
}: UserSearchProps) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | undefined>(undefined);
  const [status, setStatus] = useState<Status | undefined>(undefined);
  function onChangeSearch(value: string) {
    setSearch(value);
    handleSearch(value);
  }
  function onChangeRole(value: Role) {
    setRole(value);
    handleRole(value);
  }
  function onChangeStatus(value: Status) {
    setStatus(value);
    handleStatus(value);
  }
  return (
    <Card>
      <Row gutter={[20, 20]} justify="start" align="middle">
        <Col xs={24} md={8}>
          <Input.Search
            allowClear={true}
            placeholder="Search..."
            value={search}
            onChange={(e) => onChangeSearch(e.target.value)}
            onSearch={(val) => setSearch(val)}
          />
        </Col>

        <Col xs={20} md={4}>
          <Select
            placeholder="Select role"
            allowClear
            value={role}
            onChange={(v) => onChangeRole(v)}
            style={{ width: "100%" }}
            options={[
              { value: "admin", label: "Admin" },
              { value: "manager", label: "Manager" },
              { value: "customer", label: "Customer" },
            ]}
          />
        </Col>

        <Col xs={20} md={4}>
          <Select
            placeholder="Select status"
            allowClear
            value={status}
            onChange={(v) => onChangeStatus(v)}
            style={{ width: "100%" }}
            options={[
              { value: "ban", label: "Ban" },
              { value: "active", label: "Active" },
            ]}
          />
        </Col>

        <Col
          xs={24}
          md={8}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button type="primary" icon={<PlusOutlined />}>
            Add
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
