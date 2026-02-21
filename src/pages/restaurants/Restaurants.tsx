import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
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
import type { IQueryParms, ITenantForm, Tenants } from "../../types";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import TableFilter from "../../shared/TableFilter";
import RestaurantForm from "./RestaurantForm";
import { Pagination } from "../../constants";
import { debounce } from "lodash";
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

const tenants = async (queryParams: IQueryParms,searchRestaurant?:string) => {
  const payload: Record<string, string> = {
    perPage: String(queryParams.perPage),
    currentPage: String(queryParams.currentPage),
  };
  if (searchRestaurant?.trim()) payload.q = searchRestaurant.trim();
  const queryString = new URLSearchParams(payload).toString();

  return await allTenant(queryString);
};

const createTenant = async (data: ITenantForm) => {
  return await createTenants(data);
};

export default function Restaurants() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [searchRestaurant, setSearchRestaurant] = useState<string>("");

  const [queryParam, setQueryParam] = useState({
    perPage: Pagination.PER_PAGE,
    currentPage: 1,
  });
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [tenantStore, setTenantStore] = useState<ITenantForm>({
    name: "",
    address: "",
  });
  const { data } = useQuery({
    queryKey: ["tenants", queryParam,searchRestaurant],
    queryFn: ({ queryKey }) => {
      const [, qp] = queryKey as ["tenants", IQueryParms];
      return tenants(qp,searchRestaurant);
    },
    onSuccess: () => {
      console.log(data, "data");
    },
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

  const debounceSearch = useMemo(() => {
    return debounce((value: string) => {
      setSearchRestaurant(value);
    }, 1000);
  }, []);

  const handleSearch = (value: string) => {
    debounceSearch(value);
  };
  const handleAdd = (): void => {
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
        handleAdd={handleAdd}
        handleRole={() => {}}
        handleStatus={() => {}}
       hide={["role", "status","tenant","category","isPublished"]}
       fullWidth = {false}
      />
      <div>
        <Table<Tenants>
          columns={columns}
          dataSource={data?.data.data ?? []}
          rowKey={"id"}
          pagination={{
            total: data?.data?.count,
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
