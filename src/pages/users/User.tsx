/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useMemo, useState } from "react";
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
import { showUsers, createUser, updateUser } from "../../http/api";
import type { IQueryParms, UserData } from "../../types";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import TableFilter from "../../shared/TableFilter";
import UserForm from "./form/UserForm";
import { Pagination, UserRole } from "../../constants";
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
const updateUsers = async (payload: UserData) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cPassword, ...body } = payload;
  return await updateUser(body);
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
  const [currentEditUser, setCurrentEditUser] = useState<UserData | null>(null);
  const [editUser, setEditUser] = useState<boolean>(false);

  const [user, setUser] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    cPassword: "",
    role: "",
    tenantId: 1,
    id: 0,
  });

  useEffect(() => {
    if (currentEditUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditUser(true);
      setIsOpen(true);
      form.setFieldsValue({
        ...currentEditUser,
        tenantId: currentEditUser.tenant?.id,
      });
    }
  }, [currentEditUser,form]);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", queryParam, searchUser, searchRole],
    queryFn: ({ queryKey }) => {
      const [, qp] = queryKey as ["user", IQueryParms];
      return users(qp, searchUser, searchRole);
    },
    retry: false,
  });

  const createUser = useMutation({
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

  const updateUser = useMutation({
    mutationKey: ["updateUser"],
    mutationFn: updateUsers,
    onSuccess: async () => {
      message.success("Update user");
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
      message.error("Failed to update user");
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

  const handleAdd = (): void => setIsOpen(true);
  const handleSubmitForm = (values: UserData): void => {
    setUser(values);
  };
  const onFinish = () => {
    const payload = {
      id: currentEditUser?.id,
      firstName: user?.firstName ? user?.firstName : currentEditUser?.firstName,
      lastName: user?.lastName ? user?.lastName : currentEditUser?.lastName,
      email: user?.email ? user?.email : currentEditUser?.email,
      role: user?.role ? user?.role : currentEditUser?.role,
      tenant: user?.tenantId ? user?.tenantId : currentEditUser?.tenant?.id,
    };
    !editUser
      ? createUser.mutate(user)
      : updateUser.mutate({
          ...payload,
          tenant: payload.role !== UserRole.CUSTOMER ? payload.tenant : null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
  };
  const handleClose = () => {
    setIsOpen(false);
    setEditUser(false);
    setCurrentEditUser(null);
    form.resetFields();
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
        handleAdd={handleAdd}
        hide={['tenant',"category"]}
      />

      <Table<UserData | undefined>
        loading={isLoading}
        columns={[
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(columns as any),
          {
            title: "Actions",
            key: "action",
            render: (_, record: UserData) => (
              <Space size="middle">
                <EditFilled
                  onClick={() => {
                    setIsOpen(true);
                    setCurrentEditUser(record);
                  }}
                />
                <DeleteFilled />
              </Space>
            ),
          },
        ]}
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
        title={!editUser ? "Create user" : "Update user"}
        open={isOpen}
        width={720}
        destroyOnClose
        onClose={handleClose}
        extra={
          <Space>
            <Button
              onClick={() => setIsOpen(false)}
              disabled={createUser.isPending}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={createUser.isPending}
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
          <UserForm handleSubmitForm={handleSubmitForm} editUser={editUser}
          currentEditUser = {currentEditUser}
          />
        </Form>
      </Drawer>
    </Space>
  );
}
