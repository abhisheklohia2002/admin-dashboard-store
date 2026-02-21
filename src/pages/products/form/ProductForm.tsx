import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  Form,
} from "antd";
import { useAuthStore } from "../../../store/store";
import { UserRole } from "../../../constants";
import { useQuery } from "@tanstack/react-query";
import { allTenant, getCategories } from "../../../http/api";
import type { ICategory, IQueryParms, Tenants } from "../../../types";
import ProductImageUploader from "./ProductImage";
import Pricing from "./Pricing";
import Attributes from "./Attributes";
// import ProductImage from "./ProductImage";

type PriceConfigurationValue = {
  priceType: string;
  availableOptions: Record<string, number>;
};
type AttributeItem = { name: string; value: string | boolean | number };
type ProductEditPayload = {
  attributes?: AttributeItem[];
};
type PriceConfiguration = Record<string, PriceConfigurationValue>;
interface ProductFormProps {
  onCategoryChange?: (categoryId?: string) => void;
  onRestaurantChange?: (tenantId?: string) => void;
  onPublishChange?: (isPublish: boolean) => void;
  onProductInfoChange?: (info: { name: string; description: string }) => void;
  onProductImageChange?: (url: string, file: File) => void;
  onPriceChange?: (info: PriceConfiguration) => void;
  onAttributionChange?: (info: ProductEditPayload) => void;
}

const getCategory = async () => {
  return await getCategories();
};
const tenants = async (queryParams: IQueryParms) => {
  const payload: Record<string, string> = {
    perPage: String(queryParams.perPage),
    currentPage: String(queryParams.currentPage),
  };
  const queryString = new URLSearchParams(payload).toString();

  return await allTenant(queryString);
};

export default function ProductForm({
  onCategoryChange,
  onRestaurantChange,
  onPublishChange,
  onProductInfoChange,
  onProductImageChange,
  onPriceChange,
  onAttributionChange,
}: ProductFormProps) {
  const { user } = useAuthStore();
  const [tenant, setTenant] = useState<string | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >(undefined);

  const [priceConfig, setPriceConfig] = useState<PriceConfiguration>({});

  const [productInfo, setProductInfo] = useState({
    name: "",
    description: "",
  });
  const { data: categories } = useQuery({
    queryKey: ["category"],
    queryFn: getCategory,
    retry: false,
  });
  const { data } = useQuery({
    queryKey: ["tenants"],
    queryFn: ({ queryKey }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [, _qp] = queryKey as ["tenants", IQueryParms];
      return tenants({
        perPage: 100,
        currentPage: 1,
      });
    },
    enabled: user?.role !== UserRole.MANAGER,
  });
  const handleCategoryChange = (value?: string) => {
    setSelectedCategoryId(value);
    onCategoryChange?.(value);
  };

  const handleRestaurantChange = (value?: string) => {
    setTenant(value);
    onRestaurantChange?.(value);
  };

  const handlePublishChange = (checked: boolean) => {
    onPublishChange?.(checked);
  };

  const handleProduct = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setProductInfo((prev) => {
      const next = { ...prev, [name]: value };
      onProductInfoChange?.(next);
      return next;
    });
  };

  const handleImageChange = (url: string, file: File): void => {
    onProductImageChange?.(url, file);
  };

  const onAttributesChange = (payload: {
    enabled: boolean;
    attributes: { name: "Spiciness"; value: "Less" | "Medium" | "Hot" }[];
  }) => {
    onAttributionChange?.(payload)
  };

  useEffect(() => {
    onPriceChange?.(priceConfig);
  }, [priceConfig]);

  return (
    <Row>
      <Col span={24}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Card title="Product info" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="Product name"
                  name="name"
                  rules={[
                    { required: true, message: "Product name is required" },
                  ]}
                >
                  <Input
                    onChange={handleProduct}
                    name="name"
                    value={productInfo.name}
                    size="large"
                    placeholder="Enter product name"
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[{ required: true, message: "Category is required" }]}
                >
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    allowClear
                    placeholder="Select category"
                    options={categories?.data?.map((elem: ICategory) => {
                      return {
                        value: elem._id,
                        label: elem.name,
                      };
                    })}
                    value={selectedCategoryId}
                    onChange={(v) => handleCategoryChange(v)}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    { required: true, message: "Description is required" },
                  ]}
                >
                  <Input.TextArea
                    rows={2}
                    maxLength={100}
                    showCount
                    style={{ resize: "none" }}
                    placeholder="Short description (max 100 chars)"
                    onChange={handleProduct}
                    name="description"
                    value={productInfo.description}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <Card title="Product image" bordered={false}>
            <Row gutter={20}>
              <Col span={12}>
                <ProductImageUploader onImageChange={handleImageChange} />
              </Col>
            </Row>
          </Card>

          {user?.role !== UserRole.MANAGER && (
            <Card title="Tenant info" bordered={false}>
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    label="Restaurant"
                    name="tenantId"
                    rules={[
                      { required: true, message: "Restaurant is required" },
                    ]}
                  >
                    <Select
                      size="large"
                      style={{ width: "100%" }}
                      allowClear
                      placeholder="Select restaurant"
                      options={data?.data?.data?.map((elem: Tenants) => {
                        return {
                          value: elem?.id,
                          label: elem.name,
                        };
                      })}
                      value={tenant}
                      onChange={(v) => handleRestaurantChange(v)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

          {selectedCategoryId && (
            <Pricing setPriceConfiguation={setPriceConfig} />
          )}
          {selectedCategoryId && <Attributes onChange={onAttributesChange} />}

          <Card title="Other properties" bordered={false}>
            <Row gutter={24}>
              <Col span={24}>
                <Space>
                  <Form.Item
                    name="isPublish"
                    valuePropName="checked"
                    initialValue={false}
                  >
                    <Switch
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                      onChange={handlePublishChange}
                    />
                  </Form.Item>

                  <Typography.Text
                    style={{ marginBottom: 22, display: "block" }}
                  >
                    Published
                  </Typography.Text>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Debug (optional):
          <Typography.Text type="secondary">
            Selected category: {selectedCategoryId ?? 'none'}
          </Typography.Text>
          */}
        </Space>
      </Col>
    </Row>
  );
}
