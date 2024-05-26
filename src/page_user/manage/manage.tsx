import React, { useState } from 'react';
import { Col, Layout, MenuProps } from 'antd';
import { Menu } from 'antd';
import { Link, Outlet, Route, Routes } from "react-router-dom";
import {
    SolutionOutlined,
    BookOutlined,
    TeamOutlined
} from '@ant-design/icons';
import Analysis from "../../assets/images/analysis.png"
import UserManage from './userManage/userManage.tsx';
import JournalManage from './journalManage.tsx/journalManage.tsx';
import ConferenceManage from './conferenceManage/conferenceManage.tsx';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem(<Link to="/manage/conferenceManage" style={{ textDecoration: 'none', fontWeight: 'bolder', fontSize: '16px' }}>会议管理</Link>, '/conferenceManage', <SolutionOutlined />),
    getItem(<Link to="/manage/journalManage" style={{ textDecoration: 'none', fontWeight: 'bolder', fontSize: '16px' }}>期刊管理</Link>, '/journalManage', <BookOutlined />),
    getItem(<Link to="/manage/userManage" style={{ textDecoration: 'none', fontWeight: 'bolder', fontSize: '16px' }}>用户管理</Link>, '/userManage', <TeamOutlined />),
];

// submenu keys of first level
const rootSubmenuKeys = ['/conferenceManage', '/journalManage', '/userManage'];

function Manage() {

    // 布局相关
    const { Content, Sider } = Layout;

    const [openKeys, setOpenKeys] = useState(['/conferenceManage']);
    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };

    return (
        <Layout className='system-manage'>
            <Sider className='system-manage-sider' >
                <Menu
                    defaultSelectedKeys={['/conferenceManage']} // 默认选中会议管理页面
                    mode="inline"
                    items={items}
                    openKeys={openKeys}
                    onOpenChange={onOpenChange}
                    style={{ width: '200px', borderRadius: 10, opacity: 1, height: '350px' }}>
                </Menu>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', height: '45vh' }}>
                    <Col style={{ position: 'absolute', left: '10px' }}>
                        <img src={Analysis} style={{ height: '200px' }} />
                    </Col>
                </div>
            </Sider>

            <Layout className="system-manage-right">
                <Content >
                    <Routes>
                        <Route path="conferenceManage" element={<ConferenceManage />} />
                        <Route path='journalManage' element={<JournalManage />} />
                        <Route path="userManage" element={<UserManage />} />
                    </Routes>

                    <Outlet />

                </Content>
            </Layout>


        </Layout >


    );
};

export default Manage;