import React, { useMemo, useState } from "react";
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
import { showUsers, createUser } from "../../http/api";
import type { IQueryParms, UserData } from "../../types";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import TableFilter from "../../shared/TableFilter";
import UserForm from "./form/UserForm";
import { Pagination } from "../../constants";
import { debounce } from "lodash";


const users = async (
  queryParms: IQueryParms,
  searchUser?: string,
  searchRole?: string,
) => {
  const payload: Record<string, string> = {
    perPage: String(queryParms.perPage),
    currentPage: String(queryParms.currentPage),
  };

  if (searchUser?.trim()) payload.q = searchUser.trim();
  if (searchRole?.trim()) payload.role = searchRole.trim();
  const queryString = new URLSearchParams(payload).toString();

  return await showUsers(queryString);
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
    title: "Restaurant",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: UserData) => (
      <div>{record.tenant?.name ?? "N/A"}</div>
    ),
  },

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
  const [queryParam, setQueryParam] = useState({
    perPage: Pagination.PER_PAGE,
    currentPage: 1,
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchUser, setSearchUser] = useState<string>("");
  const [searchRole, setSearchRole] = useState<string>("");

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
    queryKey: ["user", queryParam, searchUser, searchRole],
    queryFn: ({ queryKey }) => {
      const [, qp] = queryKey as ["user", IQueryParms];
      return users(qp, searchUser, searchRole);
    },
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

  const debounceSearch = useMemo(() => {
    return debounce((value: string) => {
      setSearchUser(value);
    }, 1000);
  }, []);
  const handleSearch = (value: string) => {
    debounceSearch(value);
  };
  const handleRole = (value: string) => setSearchRole(value);
  const handleStatus = (value: string) => console.log(value, "status");

  const handleAddUser = (): void => setIsOpen(true);
  const handleSubmitForm = (values: UserData): void => {
    setUser(values);
  };
  const onFinish = () => {
    mutate(user);
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
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
        dataSource={userData?.data?.data ?? []}
        rowKey="id"
        pagination={{
          total: userData?.data?.count,
          pageSize: queryParam.perPage,
          current: queryParam.currentPage,
          onChange: (page) => {
            setQueryParam((prev) => {
              return {
                ...prev,
                currentPage: page,
              };
            });
          },
        }}
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
