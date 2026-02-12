import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { allTenant } from "../../http/api";
import {
  Breadcrumb,
  Button,
  Drawer,
  Space,
  Table,
  type TableProps,
} from "antd";
import { Link } from "react-router-dom";
import type { Tenants } from "../../types";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import TableFilter from "../../shared/TableFilter";

const columns: TableProps<Tenants>["columns"] = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },

  {
    title: "Create At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return new Date(text).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
  {
    title: "Actions",
    key: "action",
    render: (_, record: Tenants) => (
      <Space size="middle">
        <Link
          to={`/tenant/edit/${record.id}`}
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

const tenants = async () => {
  return await allTenant();
};

export default function Restaurants() {
  const [isOpen, setisOpen] = useState<boolean>(false);
  const { data } = useQuery({
    queryKey: ["tenants"],
    queryFn: tenants,
    onSuccess: () => {},
    retry: false,
  });

  const handleSearch = (value: string) => [console.log(value, "search")];
  const handleAddUser = (): void => {
    setisOpen(!isOpen);
  };
  return (
    <Space
      vertical
      size="middle"
      style={{
        width: "100%",
      }}
    >
      <Breadcrumb
        items={[{ title: <Link to="/">Dashboard</Link> }, { title: "Tenants" }]}
      />
      {/* <div>{isLoading && <div>Loading</div>}</div> */}

      <TableFilter
        handleSearch={handleSearch}
        handleAddUser={handleAddUser}
        handleRole={() => {}}
        handleStatus={() => {}}
        type="tenant"
      />
      <div>
        <Table<Tenants>
          columns={columns}
          dataSource={data?.data.tenants ?? []}
          rowKey={"id"}
        />
      </div>

      <Drawer
        title="Create Tenats"
        open={isOpen}
        width={720}
        destroyOnClose={true}
        onClose={() => {
          setisOpen(!isOpen);
        }}
        extra={
          <Space>
            <Button onClick={() => setisOpen(!isOpen)}>Cancel</Button>
            <Button type="primary">Submit</Button>
          </Space>
        }
      >
        something is coming .....
      </Drawer>
    </Space>
  );
}
