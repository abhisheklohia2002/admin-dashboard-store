import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { allTenant, createTenants } from "../../http/api";
import {
  Breadcrumb,
  Button,
  Drawer,
  message,
  Space,
  Table,
  Form,
  type TableProps,
} from "antd";
import { Link } from "react-router-dom";
import type { ITenantForm, Tenants } from "../../types";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import TableFilter from "../../shared/TableFilter";
import RestaurantForm from "./RestaurantForm";

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

const createTenant = async (data: ITenantForm) => {
  return await createTenants(data);
};

export default function Restaurants() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [isOpen, setisOpen] = useState<boolean>(false);
  const [tenantStore, setTenantStore] = useState<ITenantForm>({
    name: "",
    address: "",
  });
  const { data } = useQuery({
    queryKey: ["tenants"],
    queryFn: tenants,
    onSuccess: () => {},
    retry: false,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["createTenant"],
    mutationFn: createTenant,
    onSuccess: async () => {
      message.success("Tenant created");
      await queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setisOpen(false);
      form.resetFields();
      setTenantStore({
        name: "",
        address: "",
      });
    },
    onError: () => {
      message.error("Failed to Tenant user");
    },
  });
  const handleSearch = (value: string) => [console.log(value, "search")];
  const handleAddUser = (): void => {
    setisOpen(!isOpen);
  };

  const handleSubmitForm = (values: ITenantForm): void => {
    setTenantStore(values);
    console.log(tenantStore);
  };
  const onFinish = () => {
    mutate(tenantStore);
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
        title="Create Restaurants"
        open={isOpen}
        width={720}
        destroyOnClose={true}
        onClose={() => {
          setisOpen(!isOpen);
        }}
        extra={
          <Space>
            <Button onClick={() => setisOpen(!isOpen)}>Cancel</Button>
            <Button
              onClick={() => form.submit()}
              loading={isPending}
              type="primary"
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
          <RestaurantForm handleSubmitForm={handleSubmitForm} />
        </Form>
      </Drawer>
    </Space>
  );
}
