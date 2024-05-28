import React, { useState } from 'react';
import { Form, Input, Button, Col } from 'antd';
import { Link } from 'react-router-dom';
import Research from "../../assets/images/explore1.png"



const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const onFinish = (values: any) => {
        console.log('Received values:', values);
        // 在这里处理登录逻辑，可以进行数据验证、发送至后端等操作
    };

    return (
        <div className='login'>
            <div className='login-card'>
                <h2>用户登录</h2>
                <Form
                    name="login"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[{ type: 'email', message: '请输入有效的邮箱地址!' }, { required: true, message: '请输入邮箱!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[{ required: true, message: '请输入密码!' }]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>


                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{marginTop: "10px"}}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                <div className="manager-login-link">
                    <Link to="/managerLogin">管理员登录</Link>
                </div>
                <div className="login-link">
                    没有账号? <Link to="/register">点此注册</Link>
                </div>
            </div>
            <div>
                <Col>
                    <img src={Research} style={{ marginLeft: "20px", transform: "scaleX(-1)", height: '350px', opacity: 0.9 }} />
                </Col>
            </div>
        </div>

    );
};

export default Login;