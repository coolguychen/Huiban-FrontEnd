import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Col } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Research from "../../assets/images/research.png"
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../reducer/action';



const ManagerLogin: React.FC = () => {
    // 从 redux 拿到全局的 userInfo state
    const userLogin = useSelector((state: any) => state.userLogin)
    const { error, userInfo } = userLogin
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    // 检测到登录成功就跳转到 home
    useEffect(() => {
        if (userInfo) {
            console.log(userInfo)
            navigate('/manage', { replace: true }) // 登录成功，成功进入当前页面
        }
    }, [userInfo, error])


    // const onFinish = (values: any) => {
    //     console.log('Received values:', values);
    //     // 在这里处理登录逻辑，可以进行数据验证、发送至后端等操作
    // };

    const onFinish = (values, e) => {
        console.log('Received values:', values);
        // 在这里处理登录逻辑，可以进行数据验证、发送至后端等操作
        // e.preventDefault()
        // 执行登录动作
        console.log(email, password)
        dispatch(login(email, password))
        // dispatch(registerout())
    };

    return (
        <div className='login'>
            <div className='manager-login-card'>
                <h2>管理员登录</h2>
                <Form
                    name="login"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    <Form.Item
                        name="username"
                        label="管理员账号"
                        rules={[{ required: true, message: '请输入管理员账号!' }]}
                    >
                        <Input onChange={(e) => setEmail(e.target.value)} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[{ required: true, message: '请输入密码!' }]}
                        hasFeedback
                    >
                        <Input.Password onChange={(e) => setPassword(e.target.value)} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginTop: "10px" }}>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
                <div className="manager-login-link">
                    <Link to="/login">普通用户登录</Link>
                </div>
            </div>
            <div>
                <Col>
                    <img src={Research} style={{ marginLeft: "20px", height: '350px', opacity: 0.9 }} />
                </Col>
            </div>
        </div>

    );
};

export default ManagerLogin;