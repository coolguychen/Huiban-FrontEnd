import React, { useEffect, useState } from 'react';
import { Table, Space, Popconfirm, Button, Form, Row, Input, Col, Select, Modal, InputRef, message } from 'antd';
import {
    DeleteTwoTone,
    EditTwoTone,
    SearchOutlined,
    MailOutlined,
    ExclamationCircleFilled,
    LockOutlined,

} from '@ant-design/icons';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import axios from 'axios';

export type User = {
    userName: string; //昵称
    email: string; //邮箱
    institution: string; //科研机构
    password: string
}

const UserManage: React.FC = () => {

    const userLogin = useSelector((state: any) => state.userLogin)
    console.log(userLogin)
    const token = userLogin.userInfo.data.token;
    const [users, setUsers] = useState<User[]>([]);

    const [count, setCount] = useState(0)//负责页面更新

    useEffect(() => {
        axios.get('http://124.220.14.106:9001/api/users/list', {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': "Bearer " + token
            },
        })
            .then(response => {
                console.log(response);
                let data = response.data;
                console.log(data)
                let records = data.data;
                console.log(records)
                let userTmp: User[] = [];
                for (let i = 0; i < records.length; i++) {
                    userTmp.push({
                        email: records[i].email,
                        userName: records[i].userName,
                        institution: records[i].institution,
                        password: records[i].password
                    });
                }
                setUsers(userTmp);
                console.log(userTmp)
            })
            .catch(error => {
                console.log('Error', error.message);
            });
    }, [count]);

    // 管理员修改普通用户信息
    const [editUserForm, setEditUserForm] = useState(false);
    interface CollectionEditFormProps {
        open: boolean;
        record: User;
        onCancel: () => void;
    }


    const [editRecord, setEditRecord] = useState<User>({ email: '', userName: '', institution: '', password: '' });

    const handleEdit = (record) => {
        // Handle edit action
        console.log(record)
        setEditRecord(record)
        setEditUserForm(true)
    };

    //修改用户的表单
    const EditUserForm: React.FC<CollectionEditFormProps> = ({
        open,
        record,
        onCancel,
    }) => {
        const [form] = Form.useForm();
        // console.log(record)
        //set field value
        form.setFieldValue("email", record.email);
        form.setFieldValue("userName", record.userName);
        form.setFieldValue("institution", record.institution);
        form.setFieldValue("password", record.password);
        return (
            //用Modal弹出表单
            <Modal
                open={open} //是
                title="修改用户信息"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            const apiUrl = 'http://124.220.14.106:9001/api/users/update'; // 用户信息更新接口
                            console.log(values)
                            axios.put(apiUrl, {
                                userName: values.userName,
                                institution: values.institution,
                                email: values.email
                            }, {
                                headers: {
                                    'Content-Type': 'application/json; charset=UTF-8',
                                    'Authorization': `Bearer ${token}`
                                }
                            })
                                .then((response) => {
                                    console.log(response)
                                    if (response.status === 200) {
                                        console.log(response)
                                        message.success('修改成功！')
                                        setEditUserForm(false);
                                        setCount(count + 1)
                                    }
                                })

                                .catch((err) => {
                                    console.log(err.message);
                                    message.error('修改失败，请稍后再试！')
                                });
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{ modifier: 'public' }}
                >
                    {/* 填写邮箱 */}
                    <Form.Item
                        name="email"
                        label="邮箱"
                    >
                        <Input prefix={<MailOutlined className="site-form-item-icon" />} disabled />
                    </Form.Item>

                    {/* 填写用户名 */}
                    <Form.Item
                        name="userName"
                        label="📝用户名："
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* 填写机构 */}
                    <Form.Item
                        name="institution"
                        label="🏢科研机构"
                        rules={[{ required: true, message: '请输入科研机构' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        )
    };

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const userCols = [
        { title: '🧑‍🎓用户名', dataIndex: 'userName', key: 'userName', align: 'center' },
        { title: '📮邮箱', dataIndex: 'email', key: 'email', align: 'center' },
        { title: '🏢科研机构', dataIndex: 'institution', key: 'institution', align: 'center' },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (text, record) => (
                <Space size="middle">
                    <EditUserForm
                        open={editUserForm}
                        record={editRecord}
                        onCancel={() => {
                            setEditUserForm(false);
                        }} />
                    <EditOutlined style={{ color: 'CornflowerBlue' }} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => { setDeleteModalVisible(true); handleDeleteUser(record) }} // 确定则调用删除的接口
                        okText="确认"
                        cancelText="取消"
                    >
                        <DeleteOutlined style={{ color: 'red' }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];



    const handleDeleteUser = (record) => {
        // Handle delete action
        console.log('删除期刊：' + record);
        const email = record.email
        const apiUrl = `http://124.220.14.106:9001/api/users/${email}`; // 删除接口
        axios.delete(apiUrl, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.data.code === 200) {
                    setDeleteModalVisible(false);
                    console.log('删除用户成功', response);
                    message.success('删除用户成功')
                    // 更新关注列表，移除已删除的会议
                    setUsers(users.filter(user => user.email !== email));
                }
                else {
                    console.error('删除用户失败:',);
                    // 可以显示错误消息提示用户操作失败
                    message.error(response.data.data)
                }
            })
            .catch(error => {
                console.error('删除用户失败:', error);
                // 可以显示错误消息提示用户操作失败
                message.error('删除用户未能成功，请稍后重试。')
            });
    };

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddUser = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values) => {
        //角色属性
        const roleValue = values.role
        //加上默认图片地址
        values.imageUrl = "https://iconfont.alicdn.com/p/illus/preview_image/1SAIt26l6ecK/762012e7-e856-46b2-95f1-3abf4a83c560.png";
        // 列表为空
        values.followConferences = []
        values.followJournals = []
        values.attendConferences = []
        delete values.role //去掉values中的role属性
        console.log(values)
        axios.post('http://124.220.14.106:9001/api/users?role=' + roleValue, values, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 假设你的API使用Bearer token
            }
        }).then(response => {
            console.log(response.data)
            if (response.data.code == 200) {
                setIsModalVisible(false)
                if (roleValue === 'ROLE_ADMIN') {
                    message.success("添加管理员成功！")
                }
                else {
                    message.success("添加用户成功！")
                }
                // 更新用户列表
                setUsers(prevUser => [...prevUser, values]);
            }
            else {
                message.error(response.data.data)
            }
        })
            .catch(error => {
                console.error('添加用户失败:', error);
                // 可以显示错误消息提示用户操作失败
                message.error('添加操作未能成功，请稍后重试。')
            });
        form.resetFields();
    }

    return (
        <>
            <h3>用户管理</h3>
            <Button className="addRecord" type="primary" ghost onClick={handleAddUser}>添加用户</Button>
            <Table columns={userCols} dataSource={users} />
            <Modal title="添加用户"
                open={isModalVisible}
                okText="添加"
                cancelText="取消"
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            form.resetFields();
                            handleSubmit(values);
                        })
                        .catch((info) => {
                            console.log('Validation failed:', info);
                        });
                }}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="userName" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label='邮箱' rules={[{ type: 'email', required: true, message: '请输入邮箱' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' },
                    { min: 6, message: '密码至少需要6位' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="institution" label="科研机构">
                        <Input />
                    </Form.Item>
                    {/* 添加下拉选择项 */}
                    <Form.Item name="role" label="选择角色" rules={[{ required: true, message: '请选择角色！' }]}>
                        <Select>
                            <Select.Option value="ROLE_ADMIN">管理员</Select.Option>
                            <Select.Option value="ROLE_USER">用户</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserManage;