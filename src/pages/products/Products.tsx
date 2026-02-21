import {
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Image,
  Space,
  Table,
  Tag,
  Typography,
  type TableProps,
} from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TableFilter from "../../shared/TableFilter";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "../../constants";
import type { IProducts, IQueryParms } from "../../types";
import { showProduct } from "../../http/api";
import { format } from "date-fns";
import { debounce } from "lodash";
import ProductForm from "./form/ProductForm";

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

  {
    title: "CreatedAt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text: string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "MM/dd/yyyy HH:mm")}
        </Typography.Text>
      );
    },
  },
];

const products = async (
  queryParms: IQueryParms,
  q: string,
  categoryId: number | null,
  TenantId: number | null,
) => {
  const payload: Record<string, string> = {
    perPage: String(queryParms.perPage),
    currentPage: String(queryParms.currentPage),
  };
  if (q) payload.q = q;
  if (categoryId) payload.categoryId = String(categoryId);
  if (TenantId) payload.tenantId = String(TenantId);

  const queryString = new URLSearchParams(payload).toString();

  return await showProduct(queryString);
};

export default function Products() {
  // const queryClient = useQueryClientt();
  const [searchProduct, setSearchProduct] = useState<string>("");
  const [searchCategory, setSearchCategory] = useState<number | null>(null);
  const [searchTenant, setSearchTenant] = useState<number | null>(null);

  const [form] = Form.useForm();
  const [queryParam, setQueryParam] = useState({
    perPage: Pagination.PER_PAGE,
    currentPage: 1,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [productEdit, setproductEdit] = useState({});
  const [editProduct, seteditProduct] = useState<boolean>(false);

  const { data: productData, isLoading } = useQuery({
    queryKey: ["user", queryParam, searchProduct, searchCategory, searchTenant],
    queryFn: ({ queryKey }) => {
      const [, qp] = queryKey as ["user", IQueryParms];
      return products(qp, searchProduct, searchCategory, searchTenant);
    },
    retry: false,
  });

  const debounceSearch = useMemo(() => {
    return debounce((value: string) => {
      setSearchProduct(value);
    }, 1000);
  }, []);
  const handleSearch = (value: string) => {
    debounceSearch(value);
  };
  // const handleStatus = (value?: string) => console.log(value, "status");

  const handleAdd = (): void => setIsOpen(true);

  const debounceTenant = useMemo(() => {
    return debounce((value: number | null) => {
      setSearchTenant(value);
    }, 1000);
  }, []);
  const handleTenant = (value: number): void => {
    debounceTenant(value);
  };

  const debounceCategory = useMemo(() => {
    return debounce((value: number | null) => {
      setSearchCategory(value);
    }, 1000);
  }, []);
  const handleCategory = (value: number | null): void => {
    console.log(value, "data?.data?.data");
    debounceCategory(value);
  };

  const handleClose = () => {
    setIsOpen(false);
    seteditProduct(false);
    setproductEdit(null);
    form.resetFields();
  };

  const onCategoryChange = (categoryId: string | undefined) => {
    setproductEdit((prev) => ({
      ...prev,
      categoryId,
    }));
  };
  const onRestaurantChange = (value: string | undefined) => {
     setproductEdit((prev) => ({
      ...prev,
      tenantId:Number(value),
    }));
  };

  const onPublishChange = (value: boolean) => {
     setproductEdit((prev) => ({
      ...prev,
      isPublished:value,
    }));
  };

  const onProductInfoChange = (value: {
    name: string;
    description: string;
  }) => {
   
      setproductEdit((prev) => ({
      ...prev,
      name:value.name,
      description:value.description
    }));
  };



  useEffect(()=>{
    console.log(productEdit,'prod')
  },[productEdit])

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
                <EditFilled
                //  onClick={(_text:string,record:IProducts) => {
                //     setIsOpen(true);
                //     setproductEditUser(record);
                //   }}
                />
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

      <Drawer
        title={!editProduct ? "Create Product" : "Update Product"}
        open={isOpen}
        width={720}
        destroyOnClose
        onClose={handleClose}
        extra={
          <Space>
            <Button
              onClick={() => setIsOpen(false)}
              // disabled={createUser.isPending}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              // loading={createUser.isPending}
            >
              Submit
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          initialValues={{ remember: true }}
          // onFinish={onFinish}
          layout="vertical"
        >
          <ProductForm
            onCategoryChange={onCategoryChange}
            onRestaurantChange={onRestaurantChange}
            onPublishChange={onPublishChange}
            onProductInfoChange={onProductInfoChange}
          />
        </Form>
      </Drawer>
    </Space>
  );
}
