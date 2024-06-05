import React, { useState } from 'react';
import { Table, Space, Button, Form, Modal, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const UserManage: React.FC = () => {
    const userData = [
        { key: '1', name: 'John Doe', email: 'john.doe@example.com', institution: 'Sample Institution 1' },
        { key: '2', name: 'Jane Smith', email: 'jane.smith@example.com', institution: 'Sample Institution 2' },
        // Add more user data as needed
    ];

    const columns = [
        { title: '用户名', dataIndex: 'name', key: 'name' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '机构', dataIndex: 'institution', key: 'institution' },
        {
            title: '操作',
            key: 'action',
            render: (text: any, record: { key: React.Key; }) => (
                <Space size="middle">
                    <EditOutlined style={{ color: 'CornflowerBlue' }} onClick={() => handleEdit(record.key)} />
                    <DeleteOutlined style={{ color: 'red' }} onClick={() => handleDelete(record.key)} />
                </Space>
            ),
        },
    ];

    const handleEdit = (key: React.Key) => {
        // Handle edit action
        console.log('Edit clicked for key:', key);
    };

    const handleDelete = (key: React.Key) => {
        // Handle delete action
        console.log('Delete clicked for key:', key);
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
        onCreate(values);
        form.resetFields();
    };


    return (
        <>
            <h3>用户管理</h3>
            <Button className="addRecord" type="primary" ghost onClick={handleAddUser}>添加用户</Button>
            <Table dataSource={userData} columns={columns} />
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
                {/* Your meeting form component goes here */}
                <Form form={form} layout="vertical">
                    <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label='邮箱' rules={[{ type:'email', required: true, message: '请输入邮箱' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UserManage;