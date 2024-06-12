import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Col } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Research from "../../assets/images/explore1.png"
import { useDispatch, useSelector } from 'react-redux';
import { login, registerout } from '../../reducer/action';



const Login: React.FC = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [wrongMessage, setWrongMessage] = useState<string>('');
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // 从 redux 拿到全局的 userInfo state
    const userLogin = useSelector((state: any) => state.userLogin)
    const { error, userInfo } = userLogin

    // 检测到登录成功就跳转到 home
    useEffect(() => {
        console.log(userLogin)
        console.log(error)
        console.log(userInfo)
        if (error == '邮箱或密码错误') {
            setWrongMessage('Wrong password or wrong email!');
        } else {
            setWrongMessage('Account does not exist!')
        }

        if (userInfo) {
            console.log(userInfo)
            // navigate('/', { replace: true }) // 登录成功，成功进入当前页面
        }
    }, [userInfo, error])

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
            <div className='login-card'>
                <h2>用户登录</h2>
                <Form
                    name="login"
                    onFinish={onFinish}
                    scrollToFirstError
                >
                    {/* <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input onChange={(e)=>{
                            console.log(e.target.value)
                            setUsername(e.target.value)}
                         } />
                    </Form.Item> */}

                    <Form.Item
                        name="username"
                        label="邮箱"
                        rules={[{ type: 'email', message: '请输入有效的邮箱地址!' }, { required: true, message: '请输入邮箱!' }]}
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