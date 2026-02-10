import { LockFilled, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Flex, Input, Layout, Space, Form } from 'antd';
import Logo from '../../components/icons/Logo';

export default function LoginPage() {
  const [form] = Form.useForm();

  const onFinish = (values: { username: string; password: string; remember?: boolean }) => {
    console.log(values);
    // mutate({ email: values.username, password: values.password });
  };

  return (
    <Layout style={{ height: '100vh', display: 'grid', placeItems: 'center' }}>
      <Space direction="vertical" align="center" size="large">
        <Layout.Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Logo />
        </Layout.Content>

        <Card
          bordered={false}
          style={{ width: 300 }}
          title={
            <Space style={{ width: '100%', fontSize: 16, justifyContent: 'center',color:'#1A2B48' }}>
              <LockFilled />
              Sign in
            </Space>
          }
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Email"
              name="username"
              rules={[
                { required: true, message: 'Please input your email' },
                { type: 'email', message: 'Email is not valid' },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Password" />
            </Form.Item>

            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a href="/forgot-password" id="login-form-forgot">
                Forgot password
              </a>
            </Flex>

            <Form.Item style={{ marginTop: 16 }}>
              <Button type="primary" htmlType="submit" style={{ width: '100%',backgroundColor:"#109B9C" }}>
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </Layout>
  );
}
