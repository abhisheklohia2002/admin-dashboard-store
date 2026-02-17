import { PlusOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Input, Row, Select } from "antd";
import React, { useState } from "react";
import type { IQueryParms, Tenants } from "../types";
import { allTenant } from "../http/api";

type Role = "admin" | "manager" | "customer";
type Status = "ban" | "active";
type FilterKey = "search" | "role" | "status" | "add" | "tenant" | "category";
interface UserSearchProps {
  handleSearch?: (value: string) => void;
  handleRole?: (value: string) => void;
  handleStatus?: (value: string) => void;
  handleTenant?: (value: number) => void;
  handleCategory?: (value: number) => void;
  handleAdd?: () => void;
  hide?: FilterKey[];
  fullWidth?:boolean
}

const tenants = async (queryParams: IQueryParms) => {
  const payload: Record<string, string> = {
    perPage: String(queryParams.perPage),
    currentPage: String(queryParams.currentPage),
  };
  const queryString = new URLSearchParams(payload).toString();

  return await allTenant(queryString);
};

export default function TableFilter({
  handleSearch = () => {},
  handleRole = () => {},
  handleStatus = () => {},
  handleTenant = () => {},
  handleCategory = () => {},
  handleAdd = () => {},
  hide,
  fullWidth=true
}: UserSearchProps) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | undefined>(undefined);
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [tenant, setTenant] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<number | undefined>(undefined);

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
    onSuccess: () => {
      console.log(data?.data?.data, "data");
    },
    retry: false,
  });

  function onChangeSearch(value: string) {
    setSearch(value);
    handleSearch(value);
  }
  function onChangeRole(value: Role) {
    setRole(value);
    handleRole(value);
  }
  function onChangeStatus(value: Status) {
    setStatus(value);
    handleStatus(value);
  }
  function onChangTenant(value: number) {
    setTenant(value);
    handleTenant(value);
  }

  function onChangCategory(value: number) {
    setCategory(value);
    handleCategory(value);
  }

  const hidden = new Set(hide ?? []);
  const showSearch = !hidden.has("search");
  const showRole = !hidden.has("role");
  const showStatus = !hidden.has("status");
  const showTenant = !hidden.has("tenant");
  const showCategory = !hidden.has("category");

  return (
    <Card>
      <Row gutter={[20, 20]} justify="start" align="middle">
        {showSearch && (
          <Col xs={24} md={8}>
            <Input.Search
              allowClear={true}
              placeholder="Search..."
              value={search}
              onChange={(e) => onChangeSearch(e.target.value)}
              onSearch={(val) => setSearch(val)}
            />
          </Col>
        )}

        {/* {showRole && ( */}
        {showRole && (
          <Col xs={20} md={4}>
            <Select
              placeholder="Select role"
              allowClear
              value={role}
              onChange={(v) => onChangeRole(v)}
              style={{ width: "100%" }}
              options={[
                { value: "admin", label: "Admin" },
                { value: "manager", label: "Manager" },
                { value: "customer", label: "Customer" },
              ]}
            />
          </Col>
        )}

        {showStatus && (
          <Col xs={20} md={4}>
            <Select
              placeholder="Select status"
              allowClear
              value={status}
              onChange={(v) => onChangeStatus(v)}
              style={{ width: "100%" }}
              options={[
                { value: "ban", label: "Ban" },
                { value: "active", label: "Active" },
              ]}
            />
          </Col>
        )}

        {showTenant && (
          <Col xs={20} md={4}>
            <Select
              placeholder="Select Tenant"
              allowClear
              value={tenant}
              onChange={(v) => onChangTenant(v)}
              style={{ width: "100%" }}
              options={data?.data?.data?.map((elem: Tenants) => {
                return {
                  value: elem.id,
                  label: elem.name,
                };
              })}
            />
          </Col>
        )}

        {showCategory && (
          <Col xs={20} md={4}>
            <Select
              placeholder="Select Category"
              allowClear
              value={category}
              onChange={(v) => onChangCategory(v)}
              style={{ width: "100%" }}
              options={data?.data?.data?.map((elem: Tenants) => {
                return {
                  value: elem.id,
                  label: elem.name,
                };
              })}
            />
          </Col>
        )}

        <Col
          xs={24}
          md={fullWidth ? 8 : 16}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button onClick={handleAdd} type="primary" icon={<PlusOutlined />}>
            Add
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
