import { LockFilled, LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Flex,
  Input,
  Layout,
  Space,
  Form,
  Alert,
} from "antd";
import Logo from "../../components/icons/Logo";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { Credentials } from "../../types";
import { login, self, logout } from "../../http/api";
import { useAuthStore } from "../../store/store";
import { UserRole } from "../../constants";

const getSelf = async () => {
  const { data } = await self();
  return data;
};

const loginUser = async (userData: Credentials) => {
  const { data } = await login(userData);
  return data;
};

const successLogin = async () => {
  console.log("login successfully");
};

export default function LoginPage() {
  const { setUser } = useAuthStore();
  const [form] = Form.useForm();
  const { refetch } = useQuery({
    queryKey: ["self"],
    queryFn: getSelf,
    enabled: false,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: async () => {
      successLogin();
      const selfdata = await refetch();
      if (selfdata.data.role === UserRole.CUSTOMER) {
        await logout();
      }
      setUser(selfdata.data);
    },
  });

  const onFinish = (values: {
    username: string;
    password: string;
    remember?: boolean;
  }) => {
    mutate({ email: values.username, password: values.password });
  };

  return (
    <Layout style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <Space orientation="vertical" align="center" size="large">
        <Layout.Content
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Logo />
        </Layout.Content>

        <Card
          variant="outlined"
          style={{ width: 300 }}
          title={
            <Space
              style={{
                width: "100%",
                fontSize: 16,
                justifyContent: "center",
                color: "#1A2B48",
              }}
            >
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
            {isError && <Alert type="error" title="Something went wrong" />}
            <Form.Item
              label="Email"
              name="username"
              rules={[
                { required: true, message: "Please input your email" },
                { type: "email", message: "Email is not valid" },
              ]}
            >
              <Input
                autoComplete="off"
                prefix={<UserOutlined />}
                placeholder="Username"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password" },
              ]}
            >
              <Input.Password
                autoComplete="new-password"
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Flex justify="space-between" align="center">
              <Form.Item
                name="remember"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <a href="/forgot-password" id="login-form-forgot">
                Forgot password
              </a>
            </Flex>

            <Form.Item style={{ marginTop: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                loading={isPending}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </Layout>
  );
}
