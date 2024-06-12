import React, { useEffect, useState } from 'react';
import { Table, Space, Popconfirm, Button, Form, Row, Input, Col, Select, Modal, InputRef } from 'antd';
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
    }, []);

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const userCols = [
        { title: '用户名', dataIndex: 'userName', key: 'userName' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '机构', dataIndex: 'institution', key: 'institution' },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <EditOutlined style={{ color: 'CornflowerBlue' }} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => { setDeleteModalVisible(true);handleDeleteUser(record)}} // 确定则调用删除的接口
                        okText="确认"
                        cancelText="取消"
                    >
                        <DeleteOutlined style={{ color: 'red' }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleEdit = (record) => {
        // Handle edit action

    };

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
                    Modal.success({
                        title: '删除用户成功',
                        content: email + '已删除成功！'
                    })
                    // 更新关注列表，移除已删除的会议
                    setUsers(users.filter(user => user.email !== email));
                }
                else {
                    console.error('删除用户失败:',);
                    // 可以显示错误消息提示用户操作失败
                    Modal.error({
                        title: '删除用户失败',
                        content: response.data.data
                    })
                }
            })
            .catch(error => {
                console.error('删除用户失败:', error);
                // 可以显示错误消息提示用户操作失败
                Modal.error({
                    title: '删除用户失败',
                    content: '删除用户未能成功，请稍后重试。'
                })
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
        values.imageUrl = '';
        console.log(values)
        axios.post('http://124.220.14.106:9001/api/users', values, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 假设你的API使用Bearer token
            }
        }).then(response => {
            console.log(response.data)
            if (response.data.code == 200) {
                setIsModalVisible(false)
                console.log('添加用户成功', response);
                Modal.success({
                    title: '添加用户成功',
                    content: '已添加成功！'
                })
                // 更新关注列表，添加的会议
                setUsers(prevUser => [...prevUser, values]);
            }
            else {
                Modal.error({
                    title: '添加用户失败',
                    content: response.data.data
                })
            }
        })
            .catch(error => {
                console.error('添加用户失败:', error);
                // 可以显示错误消息提示用户操作失败
                Modal.error({
                    title: '添加用户失败',
                    content: '添加操作未能成功，请稍后重试。'
                })
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
                    <Form.Item name="instituition" label="科研机构">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserManage;