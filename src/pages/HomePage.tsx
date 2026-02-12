import React from 'react';
import { Typography } from 'antd';
import { useAuthStore } from '../store/store';
const { Title } = Typography;
export default function HomePage() {
  const {user} = useAuthStore();
  return (
    <div>
      <Title level={5}>
        Welcome,{user?.firstName}
      </Title>
    </div>
  )
}
