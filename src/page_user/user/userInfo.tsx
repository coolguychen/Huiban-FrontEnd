import React, { useEffect, useState } from "react"
import { User } from "./userType"
import { Link } from "react-router-dom";
import { Conference } from "../conference/conferenceType";
import { Button, Input, Table, Modal, Space, Popconfirm, Flex, message, Form, Tag } from "antd";
import Journal from "../journal/journalType";
import { DeleteOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reducer/action";
import axios from "axios";
import moment from "moment";
import { tools } from "../../home_page/scienceTools.tsx";
import ResearchToolCard from "../../home_page/researchToolCard.tsx";


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

    //记录参加的会议列表
    const [attendConferences, setAttendConferences] = useState<Conference[]>([]);

    const userLogin = useSelector((state: any) => state.userLogin)
    const email = userLogin.userInfo.data.username;
    const token = userLogin.userInfo.data.token;
    console.log(email, token)
    // 获取用户信息
    useEffect(() => {
        axios.get('http://124.220.14.106:9001/api/users/info', {
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

                // 过滤掉 null 和 undefined，然后设置状态
                setStarConferences(userDataTmp.followConferences.filter(item => item != null));
                setStarJournals(userDataTmp.followJournals.filter(item => item != null));
                setAttendConferences(userDataTmp.attendConferences.filter(item => item != null));
            })
            .catch(error => {
                console.log('Error', error.message);
            });
    }, []);


    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const dispatch = useDispatch();


    //删除关注的会议
    const handleDeleteFollow = (record) => {
        // 在这里调用删除接口
        console.log('删除关注的会议：' + record);
        const id = record.conferenceId
        const apiUrl = `http://124.220.14.106:9001/api/conferences/${id}/follow/sub`; // 取消关注接口
        axios.put(apiUrl, {
            email: email
        }, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('取消关注成功', response);
                setDeleteModalVisible(false); // 关闭模态框
                Modal.success({
                    title: '取消关注成功',
                    content: '您已成功取消关注。'
                })
                // 更新关注列表，移除已取消关注的会议
                setStarConferences(starConferences.filter(conference => conference.conferenceId !== id));
            })
            .catch(error => {
                console.error('取消关注失败:', error);
                // 可以显示错误消息提示用户操作失败
                Modal.error({
                    title: '操作失败',
                    content: '操作未能成功，请稍后重试。',
                });
            });
    };

    //删除参加的会议
    const handleDeleteAttend = (record) => {
        // 在这里调用删除接口
        console.log('删除关注的会议：' + record);
        const id = record.conferenceId
        const apiUrl = `http://124.220.14.106:9001/api/conferences/${id}/attend/sub`; // 取消关注接口
        axios.put(apiUrl, {
            email: email
        }, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('取消参加成功', response);
                setDeleteModalVisible(false); // 关闭模态框
                Modal.success({
                    title: '取消参加成功',
                    content: '您已成功取消参加。'
                })
                // 更新关注列表，移除已取消关注的会议
                setAttendConferences(attendConferences.filter(conference => conference.conferenceId !== id));
            })
            .catch(error => {
                console.error('取消参加失败:', error);
                // 可以显示错误消息提示用户操作失败
                Modal.error({
                    title: '操作失败',
                    content: '操作未能成功，请稍后重试。',
                });
            });
    };
    const handleDeleteFollowJournal = (record) => {
        // 在这里调用删除接口
        console.log('删除关注的期刊：' + record);
        const id = record.journalId
        const apiUrl = `http://124.220.14.106:9001/api/journals/${id}/follow/sub`; // 取消关注接口
        axios.put(apiUrl, {
            email: email
        }, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('取消关注成功', response);
                setDeleteModalVisible(false); // 关闭模态框
                Modal.success({
                    title: '取消关注成功',
                    content: '您已成功取消关注。'
                })
                // 更新关注列表，移除已取消关注的期刊
                setStarJournals(starJournals.filter(journal => journal.journalId !== id));
            })
            .catch(error => {
                console.error('取消关注失败:', error);
                Modal.error({
                    title: '操作失败',
                    content: '操作未能成功，请稍后重试。',
                });
                // 可以显示错误消息提示用户操作失败
            });
    }

    // 表格单页时隐藏分页器
    const paginationProps = {
        hideOnSinglePage: true
    }

    const followConferenceCols = [
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
                        backgroundColor = 'red';
                        break;
                    case 'B':
                        backgroundColor = 'gold';
                        break;
                    case 'C':
                        backgroundColor = 'green';
                        break;
                    default:
                        backgroundColor = 'grey';
                        ccfRank = 'N'
                }

                return (
                    <Tag color={backgroundColor}>{ccfRank}</Tag>
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
            title: '⏰摘要截止',
            dataIndex: 'abstractDeadline',
            key: 'abstractDeadline',
            align: 'center',
            render: date => date && <span>{moment(new Date(date)).format('YYYY-MM-DD')}</span>
        },
        {
            title: '🔔全文截止',
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
        // {
        //     title: '🔖接受率',
        //     dataIndex: 'acceptedRate',
        //     key: 'acceptedRate',
        //     align: 'center',
        //     render: acceptedRate => acceptedRate ? <span>{acceptedRate * 100 + '%'}</span> : <></>
        // },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => { setDeleteModalVisible(true); handleDeleteFollow(record) }} // 确定则调用删除的接口
                        okText="确认"
                        cancelText="取消"
                    >
                        <DeleteOutlined style={{ color: 'red' }} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    const attendConferenceCols = [
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
                        backgroundColor = 'red';
                        break;
                    case 'B':
                        backgroundColor = 'gold';
                        break;
                    case 'C':
                        backgroundColor = 'green';
                        break;
                    default:
                        backgroundColor = 'grey';
                        ccfRank = 'N'
                }

                return (
                    <Tag color={backgroundColor}>{ccfRank}</Tag>
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
            title: '⏰摘要截止',
            dataIndex: 'abstractDeadline',
            key: 'abstractDeadline',
            align: 'center',
            render: date => date && <span>{moment(new Date(date)).format('YYYY-MM-DD')}</span>
        },
        {
            title: '🔔全文截止',
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
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => { setDeleteModalVisible(true); handleDeleteAttend(record) }} // 确定则调用删除的接口
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
    const followJournalCols = [
        {
            title: '📜期刊',
            dataIndex: 'journalId',
            key: 'journalId',
            align: 'center',
            render: (text, record) => <Link to={`/journalDetail/${record.journalId}`}>{text}</Link>,//点击全称 跳转到期刊详情页
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
                        backgroundColor = 'red';
                        break;
                    case 'B':
                        backgroundColor = 'gold';
                        break;
                    case 'C':
                        backgroundColor = 'green';
                        break;
                    default:
                        backgroundColor = 'grey';
                        ccfRank = 'N'
                }

                return (
                    <Tag color={backgroundColor}>{ccfRank}</Tag>
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
            title: '🪄引用分数',
            dataIndex: 'citeScore',
            key: 'citeScore',
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
                        onConfirm={() => { setDeleteModalVisible(true); handleDeleteFollowJournal(record) }} // 确定则调用删除的接口
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
    const [editPasswordForm, setEditPasswordForm] = useState(false);

    interface CollectionCreateFormProps {
        open: boolean;
        onCancel: () => void;
    }

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleEditPasswordClick = () => {
        setEditPasswordForm(true);
    }

    //修改密码的表单
    const EditPasswordForm: React.FC<CollectionCreateFormProps> = ({
        open,
        onCancel,
    }) => {
        const [form] = Form.useForm();
        const [password, setPassword] = useState<string>('');
        return (
            //用Modal弹出表单
            <Modal
                open={open} //是
                title="修改密码"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            form.resetFields();
                            const apiUrl = 'http://124.220.14.106:9001/api/users/changePassword'; // 用户信息更新接口
                            axios.put(apiUrl, {
                                password: values.password,
                            }, {
                                headers: {
                                    'Content-Type': 'application/json; charset=UTF-8',
                                    'Authorization': `Bearer ${token}`
                                }
                            })
                                .then((response) => {
                                    if (response.status === 200) {
                                        console.log(response)
                                        message.success('修改密码成功！')
                                        setEditPasswordForm(false);
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
                    <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                            { required: true, message: '请输入新密码!' },
                            { min: 6, message: '密码至少为6位!' },

                        ]}
                        hasFeedback
                    >
                        <Input.Password onChange={(e) => setPassword(e.target.value)} />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="确认新密码"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: '请确认新密码!',
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
                </Form>
            </Modal>
        )
    };


    const handleSave = () => {
        // 这里可以添加保存逻辑，比如提交表单等操作
        const apiUrl = 'http://124.220.14.106:9001/api/users/update'; // 用户信息更新接口
        console.log(editedUser.email)
        axios.put(apiUrl, {
            email: email,
            userName: editedUser.userName,
            institution: editedUser.institution,
            imageUrl: userData.imageUrl
        }, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log(response);
                message.success('修改成功')
                let userDataTmp: User = {
                    imageUrl: userData.imageUrl,
                    userName: editedUser.userName,
                    email: userData.email,
                    institution: editedUser.institution,
                    followConferences: userData.followConferences,
                    followJournals: userData.followJournals,
                    attendConferences: userData.attendConferences
                };
                setUserData(userDataTmp);
            })
            .catch(error => {
                console.error(error);
                message.error('修改失败，请稍后再试！');
                // 可以显示错误消息提示用户操作失败
            });

        setEditing(false);
    };

    const handleCancel = () => {
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
                    {/* 修改密码的表单 open为true时弹出 */}
                    <EditPasswordForm
                        open={editPasswordForm}
                        onCancel={() => {
                            setEditPasswordForm(false);
                        }} />
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
                                <span>🏢科研机构: </span>
                                <Input type="text" name="institution" value={editedUser.institution}
                                    onChange={handleChange} placeholder="科研机构" />
                            </div>
                            <div style={{ width: "200px", display: 'flex', justifyContent: 'space-between', margin: "10px" }}>
                                <Button type="primary" ghost onClick={handleCancel}>取消</Button>
                                <Button type="primary" onClick={handleSave}>保存</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="info-detail">
                            <p>📝用户名：{userData.userName}</p>
                            <p>📧邮箱: {userData.email}</p>
                            <p>🏢科研机构: {userData.institution}</p>
                            <Flex gap="middle" wrap>
                                <Button type="primary" ghost onClick={handleEditClick}>
                                    修改个人信息
                                </Button>
                                <Button type="primary" ghost onClick={handleEditPasswordClick}>
                                    修改密码
                                </Button>
                            </Flex>
                        </div>
                    )}
                </div>

                <div className="follow-conference">
                    <h3 className="info">⭐ 收藏的会议</h3>
                    <div className="follow-list">
                        {
                            starConferences.length === 0 ? <p>暂无收藏会议</p> :
                                <Table columns={followConferenceCols} dataSource={starConferences}
                                    style={{ margin: 16 }} pagination={paginationProps} />
                        }
                    </div>
                </div>

                <div className="follow-conference">
                    <h3 className="info">🧑‍💻 参加的会议</h3>
                    <div className="attend-list">
                        {
                            attendConferences.length === 0 ? <p>暂无参加会议</p> :
                                <Table columns={attendConferenceCols} dataSource={attendConferences}
                                    style={{ margin: 16 }} pagination={paginationProps} />
                        }
                    </div>
                </div>

                <div className="follow-conference">
                    <h3 className="info">🧡 收藏的期刊</h3>
                    <div className="follow-list">
                        {
                            starJournals.length === 0 ? <p>暂无收藏期刊</p> :
                            <Table columns={followJournalCols} dataSource={starJournals}
                            style={{ margin: 16 }} pagination={paginationProps} />
                        }
                    </div>
                </div>

                <div>
                    <Button className="logout" type="primary" ghost onClick={handleLogout}>退出登录</Button>
                </div>


            </div>

            <div className="right-sidebar">
                <div className="tools-card">
                    <text style={{ fontWeight: "bold" }}>🧑‍🎓💡  科研直链</text>
                    {tools.map(tool => (
                        <ResearchToolCard key={tool.name} name={tool.name} url={tool.url} description={tool.description} />
                    ))}
                </div>

            </div>
        </div >
    )

}

export default UserInfo