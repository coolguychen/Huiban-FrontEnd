import React from 'react';
import { Table, Space } from 'antd';
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

    return (
        <>
            <h3>用户管理</h3>
            <Table dataSource={userData} columns={columns} />
        </>
    );
};

export default UserManage;