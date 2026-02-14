import { Col, Input, Row, Form, Card, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { allTenant } from "../../../http/api";
import { useQuery } from "@tanstack/react-query";
import type { Tenants, UserData } from "../../../types";
import { LockOutlined } from "@ant-design/icons";
import { UserRole } from "../../../constants";
type Role = "admin" | "manager" | "customer";
interface UserForm {
  handleSubmitForm: (data: UserData) => void;
  editUser?: boolean;
  currentEditUser: UserData | null;
}

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
export default function UserForm({
  handleSubmitForm,
  editUser,
  currentEditUser,
}: UserForm) {
  const [role, setRole] = useState<Role | undefined>(undefined);

  const { data } = useQuery({
    queryKey: ["tenants", editUser],
    queryFn: tenants,
    onSuccess: () => {},
    retry: false,
  });
  const [userForm, setUserForm] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cPassword: "",
    role: "",
    tenantId: 1,
    id: 0,
  });

  function onChangeRole(value: Role | undefined) {
    setRole(value);

    const next = { ...userForm, role: value ?? "" };
    setUserForm(next);
    handleSubmitForm(next);
  }

  function onChangeTenant(value: number) {
    const next = { ...userForm, tenantId: value ?? "" };
    setUserForm(next);
    handleSubmitForm(next);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setUserForm((prev) => {
    const next = { ...prev, [name]: value };
    handleSubmitForm(next); 
    return next;
  });
};


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [currentEditUser]);

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
                <Form.Item
                  rules={[
                    { required: true, message: "Please input your Firstname" },
                  ]}
                  label="First name"
                  name="firstName"
                >
                  <Input
                    onChange={handleForm}
                    value={userForm.firstName}
                    name="firstName"
                    size="large"
                    placeholder=""
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  rules={[
                    { required: true, message: "Please input your LastName" },
                  ]}
                  label="Last name"
                  name="lastName"
                >
                  <Input
                    value={userForm.lastName}
                    name="lastName"
                    onChange={handleForm}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={"12px"}>
              <Col span={12}>
                <Form.Item
                  rules={[
                    { required: true, message: "Please input your Email" },
                  ]}
                  label="Email"
                  name="email"
                >
                  <Input
                    value={userForm.email}
                    name="email"
                    onChange={handleForm}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {!editUser ? (
            <Card title="Security info">
              <Row gutter={"12px"}>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      { required: true, message: "Please input your password" },
                    ]}
                    label="Password"
                    name="password"
                  >
                    <Input
                      onChange={handleForm}
                      prefix={<LockOutlined />}
                      size="large"
                      type="password"
                      value={userForm.password}
                      name="password"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Please input your Confirm password",
                      },
                    ]}
                    label="Confirm password"
                    name="confirm_password"
                  >
                    <Input
                      prefix={<LockOutlined />}
                      size="large"
                      type="password"
                      onChange={handleForm}
                      value={userForm.cPassword}
                      name="cPassword"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          ) : (
            <></>
          )}

          <Card title="Role">
            <Row gutter={"12px"}>
              <Col span={12}>
                <Form.Item
                  rules={[
                    { required: true, message: "Please input your Role" },
                  ]}
                  label="role"
                  name="role"
                >
                  <Select
                    size="large"
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
                </Form.Item>
              </Col>

              {(userForm.role || currentEditUser?.role) !==
              UserRole.CUSTOMER ? (
                <Col span={12}>
                  <Form.Item
                    rules={[
                      { required: true, message: "Please input your Tenant" },
                    ]}
                    label="Tenant"
                    name="tenantId"
                  >
                    <Select
                      size="large"
                      placeholder="Select Tenant"
                      allowClear
                      value={userForm.tenantId}
                      onChange={(v) => onChangeTenant(v)}
                      style={{ width: "100%" }}
                      options={tenantsDataSource(data?.data.data ?? [])}
                    />
                  </Form.Item>
                </Col>
              ) : (
                <></>
              )}
            </Row>
          </Card>
        </Space>
      </Col>
    </Row>
  );
}
