import React, { useState } from "react";
import { Card, Space, Switch, Typography, Segmented } from "antd";

type SpicinessValue = "Less" | "Medium" | "Hot";

type AttributesLikeMockProps = {

  initialEnabled?: boolean;
  initialSpiciness?: SpicinessValue;

  onChange?: (payload: {
    enabled: boolean;
    attributes: { name: "Spiciness"; value: SpicinessValue }[];
  }) => void;
};

export default function Attributes({
  initialEnabled = true,
  initialSpiciness = "Less",
  onChange,
}: AttributesLikeMockProps) {
  const [enabled, setEnabled] = useState<boolean>(initialEnabled);
  const [spiciness, setSpiciness] = useState<SpicinessValue>(initialSpiciness);

  const emit = (nextEnabled: boolean, nextSpiciness: SpicinessValue) => {
    onChange?.({
      enabled: nextEnabled,
      attributes: [{ name: "Spiciness", value: nextSpiciness }],
    });
  };

  const handleEnabledChange = (checked: boolean) => {
    setEnabled(checked);
    emit(checked, spiciness);
  };

  const handleSpicinessChange = (value: string | number) => {
    const next = value as SpicinessValue;
    setSpiciness(next);
    emit(enabled, next);
  };

  return (
    <Card title="Attributes" bordered>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Switch
          checked={enabled}
          onChange={handleEnabledChange}
          checkedChildren="Yes"
          unCheckedChildren="No"
        />

        <div>
          <Typography.Text>
            <Typography.Text type="danger">*</Typography.Text> Spiciness
          </Typography.Text>

          <div style={{ marginTop: 10 }}>
            <Segmented
              block
              disabled={!enabled}
              options={["Less", "Medium", "Hot"]}
              value={spiciness}
              onChange={handleSpicinessChange}
            />
          </div>
        </div>
      </Space>
    </Card>
  );
}