import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  Button,
  Drawer,
  Space,
  Table,
  Form,
  type TableProps,
} from "antd";
import { Link } from "react-router-dom";
import { showUsers } from "../../http/api";
import type { UserData } from "../../types";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import TableFilter from "../../shared/TableFilter";
import UserForm from "./form/UserForm";

const users = async () => {
  return await showUsers();
};

const columns: TableProps<UserData>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: `firstName`,
    key: "firstName",
    render: (_text: string, record: UserData) => {
      return (
        <Link to={`/user/${record?.id}`}>
          {record.firstName} {record.lastName}
        </Link>
      );
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
  },

  {
    title: "Actions",
    key: "action",
    render: (_, record: UserData) => (
      <Space size="middle">
        <Link
          to={`/user/edit/${record.id}`}
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <EditFilled />
        </Link>

        <DeleteFilled />
      </Space>
    ),
  },
];

export default function User() {
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: users,
    retry: false,
  });
  const [isOpen, setisOpen] = useState<boolean>(false);
  const handleSearch = (value: string) => [console.log(value, "search")];
  const handleRole = (value: string) => [console.log(value, "role")];
  const handleStatus = (value: string) => [console.log(value, "role")];
  const handleAddUser = (): void => {
    setisOpen(!isOpen);
  };
  return (
    <>
      <Space
        vertical
        size="middle"
        style={{
          width: "100%",
        }}
      >
        <Breadcrumb
          items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]}
        />
        {/* <div>{isLoading && <div>Loading</div>}</div> */}

        <TableFilter
          handleSearch={handleSearch}
          handleRole={handleRole}
          handleStatus={handleStatus}
          handleAddUser={handleAddUser}
        />
        <div>
          <Table<UserData>
            columns={columns}
            dataSource={data?.data.msg ?? []}
            rowKey={"id"}
          />
        </div>

        <Drawer
          title="Create user"
          open={isOpen}
          width={720}
          destroyOnClose={true}
          onClose={() => {
            setisOpen(!isOpen);
          }}
         style={{
          backgroundColor:""
         }}
          extra={
            <Space>
              <Button
              onClick={()=>setisOpen(!isOpen)}
              >Cancel</Button>
              <Button
              type="primary"
              >Submit</Button>
            </Space>
          }
        >
          <Form layout="vertical">
           <UserForm/>
          </Form>
        </Drawer>
      </Space>
    </>
  );
}
