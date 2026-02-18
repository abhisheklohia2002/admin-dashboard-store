import {
  Breadcrumb,
  Form,
  Image,
  Space,
  Table,
  Tag,
  Typography,
  type TableProps,
} from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import TableFilter from "../../shared/TableFilter";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "../../constants";
import type { IProducts, IQueryParms } from "../../types";
import { showProduct } from "../../http/api";
import { format } from "date-fns";

const columns: TableProps<IProducts>["columns"] = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_text: string, record: IProducts) => (
      <div>
        <Space>
          <Image width={60} src={record.image} preview={false} />
          <Typography.Text>{record.name}</Typography.Text>
        </Space>
      </div>
    ),
  },
  { title: "Description", dataIndex: "description", key: "description" },
  {
    title: "Status",
    dataIndex: "isPublished",
    key: "isPublished",
    render: (_text: boolean, record: IProducts) => {
      return record?.isPublished ? (
        <Tag
          style={{
            padding: "10px",
            borderRadius: "12px",
          }}
          color="green"
        >
          Published
        </Tag>
      ) : (
        <Tag
          style={{
            padding: "10px",
            borderRadius: "12px",
          }}
          color="red"
        >
          Draft
        </Tag>
      );
    },
  },

  { title: "CreatedAt", dataIndex: "createdAt", key: "createdAt",
    render:(text:string)=>{
      return (
        <Typography.Text>
          {
            format(new Date(text), "MM/dd/yyyy HH:mm")
          }
        </Typography.Text>
      )
    }
   },
];

const products = async (queryParms: IQueryParms) => {
  const payload: Record<string, string> = {
    perPage: String(queryParms.perPage),
    currentPage: String(queryParms.currentPage),
  };

  const queryString = new URLSearchParams(payload).toString();

  return await showProduct(queryString);
};

export default function Products() {
  // const queryClient = useQueryClientt();
  // const [form] = Form.useForm();
  const [queryParam, setQueryParam] = useState({
    perPage: Pagination.PER_PAGE,
    currentPage: 1,
  });
  // const [isOpen, setIsOpen] = useState<boolean>(false);
  // const [currentEditUser, setCurrentEditUser] = useState(null);

  const { data: productData, isLoading } = useQuery({
    queryKey: ["user", queryParam],
    queryFn: ({ queryKey }) => {
      const [, qp] = queryKey as ["user", IQueryParms];
      return products(qp);
    },
    onSuccess: () => {
      console.log(productData?.data?.products, "dproductDataa");
    },
    retry: false,
  });
  const handleSearch = (value?: string) => {
    // debounceSearch(value);
  };
  const handleRole = (value?: string) => {};
  // const handleStatus = (value?: string) => console.log(value, "status");

  const handleAdd = (): void => {};
  const handleTenant = (value: number): void => {
    console.log(value, "data?.data?.data");
  };

  const handleCategory = (value: number): void => {
    console.log(value, "data?.data?.data");
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Breadcrumb
        items={[
          { title: <Link to="/">Dashboard</Link> },
          { title: "Products" },
        ]}
      />
      <TableFilter
        handleSearch={handleSearch}
        handleRole={handleRole}
        handleAdd={handleAdd}
        handleTenant={handleTenant}
        handleCategory={handleCategory}
        hide={["role", "status"]}
      />

      <Table
        loading={isLoading}
        columns={[
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(columns as any),
          {
            title: "Actions",
            key: "action",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: () => (
              <Space size="middle">
                {/* <EditFilled
                  onClick={() => {
                    setIsOpen(true);
                    setCurrentEditUser(record);
                  }}
                /> */}
                <DeleteFilled />
              </Space>
            ),
          },
        ]}
        dataSource={productData?.data?.products ?? []}
        rowKey="id"
        pagination={{
          total: productData?.data?.total,
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
    </Space>
  );
}
