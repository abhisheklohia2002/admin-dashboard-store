import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Breadcrumb,
  Button,
  Drawer,
  Space,
  Table,
  Form,
  type TableProps,
  message,
} from "antd";
import { Link } from "react-router-dom";
import { showUsers , createUser } from "../../http/api";
import type { UserData } from "../../types";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import TableFilter from "../../shared/TableFilter";
import UserForm from "./form/UserForm";

const users = async () => {
  return await showUsers();
};

const createUsers = async (payload: UserData) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cPassword, ...body } = payload;
  return await createUser(body);
};

const columns: TableProps<UserData>["columns"] = [
  { title: "ID", dataIndex: "id", key: "id" },
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text: string, record: UserData) => (
      <Link to={`/user/${record?.id}`}>
        {record.firstName} {record.lastName}
      </Link>
    ),
  },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Role", dataIndex: "role", key: "role" },
  {
    title: "Actions",
    key: "action",
    render: (_, record: UserData) => (
      <Space size="middle">
        <Link
          to={`/user/edit/${record.id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <EditFilled />
        </Link>
        <DeleteFilled />
      </Space>
    ),
  },
];

export default function User() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [user, setUser] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cPassword: "",
    role: "",
    tenantId: 1,
  });

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: users,
    retry: false,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["createUser"],
    mutationFn: createUsers,
    onSuccess: async () => {
      message.success("User created");
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      setIsOpen(false);
      form.resetFields();
      setUser({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        cPassword: "",
        role: "",
        tenantId: 1,
      });
    },
    onError: () => {
      message.error("Failed to create user");
    },
  });

  const handleSearch = (value: string) => console.log(value, "search");
  const handleRole = (value: string) => console.log(value, "role");
  const handleStatus = (value: string) => console.log(value, "status");

  const handleAddUser = (): void => setIsOpen(true);
  const handleSubmitForm = (values: UserData): void => {
    setUser(values);
  };
  const onFinish = () => {
    mutate(user);
  };

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ width: "100%" }}
    >
      <Breadcrumb
        items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]}
      />

      <TableFilter
        handleSearch={handleSearch}
        handleRole={handleRole}
        handleStatus={handleStatus}
        handleAddUser={handleAddUser}
      />

      <Table<UserData>
        loading={isLoading}
        columns={columns}
        dataSource={userData?.data?.msg ?? []}
        rowKey="id"
      />

      <Drawer
        title="Create user"
        open={isOpen}
        width={720}
        destroyOnClose
        onClose={() => setIsOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setIsOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={isPending}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <UserForm handleSubmitForm={handleSubmitForm} />
        </Form>
      </Drawer>
    </Space>
  );
}
