import React, { useMemo, useState } from "react";
import { Card, InputNumber, Space, Tag, Typography } from "antd";

type PriceConfigurationValue = {
  priceType: string;
  availableOptions: Record<string, number>;
};

type PriceConfiguration = Record<string, PriceConfigurationValue>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Pricing({setPriceConfiguation}:any) {
  const [priceConfig, setPriceConfig] = useState<PriceConfiguration>({
    Size: {
      priceType: "base",
      availableOptions: { Small: 0, Medium: 0, Large: 0 },
    },
    Crust: {
      priceType: "aditional",
      availableOptions: { Thin: 0, "Cheese Burst": 0 },
    },
  });

  const groups = useMemo(() => Object.entries(priceConfig), [priceConfig]);

  const handlePriceChange = (groupName: string, optionName: string, value: number | null) => {
    setPriceConfig((prev) => ({
      ...prev,
      [groupName]: {
        ...prev[groupName],
        availableOptions: {
          ...prev[groupName].availableOptions,
          [optionName]: value ?? 0,
        },
      },
    }));

    setPriceConfiguation(priceConfig)
  };

  return (
    <Card title={<Typography.Text>Product Price</Typography.Text>} bordered>
      {groups.length === 0 ? (
        <Typography.Text type="secondary">No price configuration found.</Typography.Text>
      ) : (
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {groups.map(([groupName, groupValue]) => {
            const options = Object.entries(groupValue.availableOptions ?? {});
            return (
              <div key={groupName}>
                <Space align="center" wrap>
                  <Typography.Text strong>{groupName}</Typography.Text>
                  <Tag>{groupValue.priceType}</Tag>
                </Space>

                <div style={{ marginTop: 10 }}>
                  {options.map(([optionName, price]) => (
                    <div
                      key={`${groupName}-${optionName}`}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      <Typography.Text>{optionName}</Typography.Text>

                      <InputNumber
                        min={0}
                        value={price}
                        onChange={(v) => handlePriceChange(groupName, optionName, v)}
                        style={{ width: 140 }}
                      />
                    </div>
                  ))}
                </div>

                {/* <Divider style={{ margin: "12px 0" }} /> */}
              </div>
            );
          })}
        </Space>
      )}
    </Card>
  );
}