import React, { useState } from 'react';
import { Form, Input, Button, Col, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Research from "../../assets/images/research1.png"
import { register } from "../../reducer/action";
import { useDispatch, useSelector } from 'react-redux';
import { RegisterInfo } from './registerType';
import axios from 'axios';


const Register: React.FC = () => {

    const [userName, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userRegister = useSelector((state: any) => state.userRegister)
    const { error, userRegisterInfo } = userRegister


    const onFinish = (values, e) => {
        // e.preventDefault()
        console.log('Received values:', values);
        // 在这里处理注册逻辑，可以进行数据验证、发送至后端等操作
        console.log(userRegisterInfo)
        const config = {
            headers: {
                'content-Type': 'application/json'
            }
        }
        // 注册
        axios.post(
            'http://124.220.14.106:9001/auth/register', // 调用注册的api
            { userName, email, password },
            config
        ).then(response => {
            console.log(response.data)
            var data = response.data
            if (data.code === 200) {
                message.success('注册成功！')
                navigate('/login', { replace: true })
            }
            if (data.code === 405) {
                message.error('已经存在该用户')
            }
        })
    };

    return (
        <div className='register'>
            <div className='register-card'>
                <h2>用户注册</h2>
                <Form
                    name="register"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Form.Item
                        name="userName"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input onChange={(e) => setUsername(e.target.value)} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[{ type: 'email', message: '请输入有效的邮箱地址!' }, { required: true, message: '请输入邮箱!' }]}
                    >
                        <Input onChange={(e) => setEmail(e.target.value)} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                            { required: true, message: '请输入密码!' },
                            { min: 6, message: '密码至少为6位!' },

                        ]}
                        hasFeedback
                    >
                        <Input.Password onChange={(e) => setPassword(e.target.value)} />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="确认密码"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '请确认密码!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginTop: "10px" }}>
                            注册
                        </Button>
                    </Form.Item>
                </Form>
                <div className="login-link">
                    已有账号? <Link to="/login">点此登录</Link>
                </div>
            </div>
            <div>
                <Col>
                    <img src={Research} style={{ height: '410px', opacity: 0.9 }} />
                </Col>
            </div>
        </div>

    );
};

export default Register;