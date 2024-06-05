import React, { useEffect, useState } from "react"
import { User } from "./userType"
import { Link } from "react-router-dom";
import { Conference } from "../conference/conferenceType";
import { Button, Input, Table, Modal, Space, Popconfirm } from "antd";
import Journal from "../journal/journalType";
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reducer/action";
import axios from "axios";
import moment from "moment";


const UserInfo: React.FC = () => {

    // 记录用户数据
    const [userData, setUserData] = useState<User>({
        imageUrl: "",
        userName: "",
        email: "",
        institution: "",
        followConferences: [],
        followJournals: [],
        attendConferences: []
    });
    
    //记录收藏会议列表
    const [starConferences, setStarConferences] = useState<Conference[]>([]);
    const [starJournals, setStarJournals] = useState<Journal[]>([]);

    const userLogin = useSelector((state: any) => state.userLogin)
    const email = userLogin.userInfo.data.username;
    const token = userLogin.userInfo.data.token;
    console.log(email, token)
    // 获取用户信息
    useEffect(() => {
        axios.get('http://124.220.14.106:9001/api/users/info/' + email, {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': "Bearer " + token
            },
        })
            .then(response => {
                console.log(response);
                let data = response.data;
                console.log(data)
                console.log(data.data);
                let records = data.data;
                console.log(records)
                let userDataTmp: User = {
                    imageUrl: records.imageUrl,
                    userName: records.userName,
                    email: records.email,
                    institution: records.institution,
                    followConferences: records.followConferences,
                    followJournals: records.followJournals,
                    attendConferences: records.attendConferences
                };
                setUserData(userDataTmp);
                console.log(userDataTmp)
            })
            .catch(error => {
                console.log('Error', error.message);
            });
    }, []);


    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);
    const dispatch = useDispatch();

    const handleDelete = () => {
        // 在这里调用删除接口
        console.log('调用删除接口');
        setDeleteModalVisible(false);
    };

    // 表格单页时隐藏分页器
    const paginationProps = {
        hideOnSinglePage: true
    }

    const conferenceCols = [
        {
            title: '📙简称',
            dataIndex: 'conferenceId',
            key: 'conferenceId',
            align: 'center',
            render: (text, record) => (
                <Link to={`/conferenceDetail/${record.conferenceId}`} style={{ color: 'blue', fontWeight: 'bold' }}>
                    {text}
                </Link>
            ),
        },
        {
            title: '📖全称',
            dataIndex: 'fullTitle',
            key: 'fullTitle',
            align: 'center',
            render: (text, record) => <a href={record.mainpageLink}>{text}</a> //点击全称 跳转到主页
        },
        {
            title: '🏷️类型',
            dataIndex: 'sub',
            key: 'sub',
            align: 'center',

        },
        {
            title: '🏆CCF',
            dataIndex: 'ccfRank',
            key: 'ccfRank',
            align: 'center',
            // 据不同的条件渲染为不同颜色，同时使该标签带有圆角
            render: (ccfRank) => {
                if (!ccfRank) return null; // 如果 ccfRank 为空，则为N

                let backgroundColor;
                switch (ccfRank) {
                    case 'A':
                        backgroundColor = 'pink';
                        break;
                    case 'B':
                        backgroundColor = 'gold';
                        break;
                    case 'C':
                        backgroundColor = 'honeydew';
                        break;
                    default:
                        backgroundColor = 'grey';
                        ccfRank = 'N'
                }

                return (
                    <span style={{ backgroundColor, padding: '5px', borderRadius: '5px' }}>{ccfRank}</span>
                );
            },

            filters: [
                {
                    text: 'A',
                    value: 'A',
                },
                {
                    text: 'B',
                    value: 'B',
                },
                {
                    text: 'C',
                    value: 'C',
                },
            ],
            onFilter: (value, record) => record.ccfRank === value,
        },
        {
            title: '❓延期',
            dataIndex: 'isPostponed',
            key: 'isPostponed',
            align: 'center',
            render: (isPostponed) => {
                if (isPostponed) { // 如果延期
                    return <span style={{ backgroundColor: 'red', padding: '5px', borderRadius: '5px' }}>延期</span>
                }
            }
        },
        {
            title: '⏰摘要截止日期',
            dataIndex: 'abstractDeadline',
            key: 'abstractDeadline',
            align: 'center',
            render: date => date && <span>{moment(new Date(date)).format('YYYY-MM-DD')}</span>
        },
        {
            title: '🔔全文截止日期',
            dataIndex: 'paperDeadline',
            key: 'paperDeadline',
            align: 'center',
            render: date => date && <span>{moment(new Date(date)).format('YYYY-MM-DD')}</span>
        },
        {
            title: '📅开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
            align: 'center',
            render: date => date && <span>{moment(new Date(date)).format('YYYY-MM-DD')}</span>
        },
        {
            title: '📆结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            align: 'center',
            render: date => date && <span>{moment(new Date(date)).format('YYYY-MM-DD')}</span>
        },
        {
            title: '📍地点',
            dataIndex: 'place',
            key: 'place',
            align: 'center',
            render: place => <span>{place}</span>,
        },
        {
            title: '🔖接受率',
            dataIndex: 'acceptedRate',
            key: 'acceptedRate',
            align: 'center',
            render: acceptedRate => <span>{acceptedRate * 100 + '%'}</span>
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => { setRecordToDelete(record); setDeleteModalVisible(true); }} // 确定则调用删除的接口
                        okText="确认"
                        cancelText="取消"
                    >
                        <DeleteOutlined style={{ color: 'red' }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // 定义列
    const journalCols = [
        {
            title: '📜期刊',
            dataIndex: 'journalId',
            key: 'journalId',
            align: 'center',
            render: (text, record) => <Link to={`/journalDetail/${record.journalId}`}>{text}</Link>,//点击全称 跳转到期刊详情页
        },
        {
            title: '🏆CCF',
            dataIndex: 'ccfRank',
            key: 'ccfRank',
            align: 'center',
            // 据不同的条件渲染为不同颜色，同时使该标签带有圆角
            render: (ccfRank) => {
                if (!ccfRank) return null; // 如果 ccfRank 为空，则不渲染

                let backgroundColor;
                switch (ccfRank) {
                    case 'A':
                        backgroundColor = 'pink';
                        break;
                    case 'B':
                        backgroundColor = 'gold';
                        break;
                    case 'C':
                        backgroundColor = 'honeydew';
                        break;
                    default:
                        backgroundColor = '';
                        ccfRank = 'N'
                }

                return (
                    <span style={{ backgroundColor, padding: '5px', borderRadius: '5px' }}>{ccfRank}</span>
                );
            },
            filters: [
                {
                    text: 'A',
                    value: 'A',
                },
                {
                    text: 'B',
                    value: 'B',
                },
                {
                    text: 'C',
                    value: 'C',
                },
            ],
            onFilter: (value, record) => record.ccfRank === value,
        },
        {
            title: '🎯影响因子',
            dataIndex: 'impactFactor',
            key: 'impactFactor',
            align: 'center'
        },
        {
            title: '📚出版社',
            dataIndex: 'publisher',
            key: 'publisher',
            align: 'center'
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => { setRecordToDelete(record); setDeleteModalVisible(true); }} // 确定则调用删除的接口
                        okText="确认"
                        cancelText="取消"
                    >
                        <DeleteOutlined style={{ color: 'red' }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const [editing, setEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ userName: userData.userName, email: userData.email, institution: userData.institution });

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleSave = () => {
        // 这里可以添加保存逻辑，比如提交表单等操作
        setEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleLogout = () => {
        dispatch(logout())
    }

    return (
        <div className="flex-container">
            <div className="left-sidebar">
                <div className="basic-info">
                    <h3 className="info">📂 个人信息</h3>
                    <div className="avatar-container">
                        <div className="avatar">
                            <img src={userData.imageUrl} alt="User Avatar" />
                        </div>
                    </div>
                    {editing ? (
                        <div className="edit-profile">
                            <div>
                                <span>📝用户名：</span>
                                <Input type="text" name="userName" value={editedUser.userName}
                                    onChange={handleChange}
                                    placeholder="用户名" />
                            </div>
                            <div>
                                <span>📧邮箱：</span>
                                <Input type="text" name="email" value={editedUser.email}
                                    onChange={handleChange} placeholder="邮箱" />
                            </div>
                            <div>
                                <span>🏢科研机构: </span>
                                <Input type="text" name="institution" value={editedUser.institution}
                                    onChange={handleChange} placeholder="科研机构" />
                            </div>
                            <Button type="primary" onClick={handleSave}>保存</Button>
                        </div>
                    ) : (
                        <div>
                            <p>📝用户名：{userData.userName}</p>
                            <p>📧邮箱: {userData.email}</p>
                            <p>🏢科研机构: {userData.institution}</p>
                            <Button type="primary" ghost onClick={handleEditClick}>
                                修改
                            </Button>
                        </div>
                    )}
                </div>

                <div className="follow-conference">
                    <h3 className="info">⭐ 收藏的会议</h3>
                    <div className="follow-list">
                        <Table columns={conferenceCols} dataSource={starConferences}
                            style={{ margin: 16 }} pagination={paginationProps} />
                    </div>
                </div>

                <div className="attend-conference">
                    <h3 className="info">🧑‍💻 参加的会议</h3>
                    <div className="attend-list">
                        <Table columns={conferenceCols} dataSource={starConferences}
                            style={{ margin: 16 }} pagination={paginationProps} />
                    </div>
                </div>

                <div className="follow-journal">
                    <h3 className="info">🧡 收藏的期刊</h3>
                    <div className="follow-list">
                        <Table columns={journalCols} dataSource={starJournals}
                            style={{ margin: 16 }} pagination={paginationProps} />
                    </div>
                </div>

                <div>
                    <Button className="logout" type="primary" ghost onClick={handleLogout}>退出登录</Button>
                </div>


            </div>

            <div className="right-sidebar">
                <div className="tools-card">
                    待开发（一些初步的想法）：
                    一些科研工具推荐？用户点击可以直接跳转？
                    根据用户的关注和收藏，推荐会议和期刊的算法？
                </div>

            </div>
        </div>
    )

}

export default UserInfo