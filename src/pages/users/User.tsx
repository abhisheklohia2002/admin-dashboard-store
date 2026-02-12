import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumb, Space, Table, type TableProps } from "antd";
import { Link } from "react-router-dom";
import { showUsers } from "../../http/api";
import type { UserData } from "../../types";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import UserFilter from "./UserFilter";

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
  const handleSearch=(value:string)=>[
    console.log(value,'search')
  ]
  const handleRole=(value:string)=>[
    console.log(value,'role')
  ]
  const handleStatus=(value:string)=>[
    console.log(value,'role')
  ]
  return (
    <>
    <Space vertical 
    size="middle"
    style={{
        width:'100%'
    }}
    >
      <Breadcrumb
        items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Users" }]}
      />
      {/* <div>{isLoading && <div>Loading</div>}</div> */}

      <UserFilter handleSearch = {handleSearch} handleRole = {handleRole} handleStatus = {handleStatus} />
      <div>
        <Table<UserData>   columns={columns} dataSource={data?.data.msg ?? []} rowKey={"id"} />
      </div>
    </Space>
    </>
  );
}
