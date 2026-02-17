import { Breadcrumb, Space } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import TableFilter from "../../shared/TableFilter";

export default function Products() {
  const handleSearch = (value?: string) => {
    // debounceSearch(value);
  };
  const handleRole = (value?: string) => {};
  // const handleStatus = (value?: string) => console.log(value, "status");

  const handleAdd = (): void => {};
  const handleTenant = (value:number): void => {
    console.log(value,'data?.data?.data')
  };

   const handleCategory = (value:number): void => {
    console.log(value,'data?.data?.data')
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
        handleCategory= {handleCategory}
       hide={["role", "status"]}
      />
    </Space>
  );
}
