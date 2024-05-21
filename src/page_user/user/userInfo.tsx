import React, { useState } from "react"
import { User } from "./userType"
import { Link } from "react-router-dom";
import { Conference } from "../conference/conferenceType";
import { Button, Input, Table } from "antd";
import Journal from "../journal/journalType";
import { UserOutlined } from '@ant-design/icons';


const exampleUser: User = {
    userName: "example",
    email: "example@email.com",
    imageUrl: "https://iconfont.alicdn.com/p/illus/preview_image/1SAIt26l6ecK/9dd5ffa2-becc-4088-9f34-e92e332e6186.png",
    institution: "EAST CHINA NORMAL UNIVERSITY"
}

const starConferences: Conference[] = [
    {
        conferenceId: "CIKM2024",
        title: "CIKM",
        fullTitle: "ACM International Conference on Information and Knowledge Management 2024",
        ccfRank: "B",
        sub: "数据库/数据挖掘/内容检索",
        year: 2024,
        dblpLink: "", // 填入对应链接
        mainpageLink: "https://cikm2024.org/",
        place: "Boise, Idaho, USA",
        abstractDeadline: new Date("2024-05-13"),
        paperDeadline: new Date("2024-07-16"),
        startTime: new Date("2024-10-21"),
        acceptedRate: 0.22, // 添加接受率
        isPostponed: false
    },
];

const starJournals: Journal[] = [
    {
        journalId: "IS",
        fullTitle: "Information Systems",
        ccfRank: "A",
        mainpageLink: "http://www.journals.elsevier.com/information-systems/",
        specialIssue: "Special Issue on Data Analytics",
        paperDeadline: new Date("2024-06-30"),
        impactFactor: 4.5,
        publisher: "Elsevier"
    },
];

const UserInfo: React.FC = () => {


    // 定义会议列
    const conferenceCol = [
        {
            title: '简称',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Link to={`/conferenceDetail/${record.conferenceId}`} style={{ color: 'blue', fontWeight: 'bold' }}>
                    {text}
                </Link>
            ),
        },
        {
            title: '全称',
            dataIndex: 'fullTitle',
            key: 'fullTitle',
            render: (text, record) => <a href={record.mainpageLink}>{text}</a> //点击全称 跳转到主页
        },
        {
            title: '类型',
            dataIndex: 'sub',
            key: 'sub',
        },
        {
            title: 'CCF',
            dataIndex: 'ccfRank',
            key: 'ccfRank',
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
            title: '延期',
            dataIndex: 'isPostponed',
            key: 'isPostponed',
            render: (isPostponed) => {
                if (isPostponed) { // 如果延期
                    return <span style={{ backgroundColor: 'red', padding: '5px', borderRadius: '5px' }}>延期</span>
                }
            }
        },
        {
            title: '摘要截止日期',
            dataIndex: 'abstractDeadline',
            key: 'abstractDeadline',
            render: date => <span>{date.toDateString()}</span>,
        },
        {
            title: '全文截止日期',
            dataIndex: 'paperDeadline',
            key: 'paperDeadline',
            render: date => <span>{date.toDateString()}</span>,
        },
        {
            title: '开会时间',
            dataIndex: 'startTime',
            key: 'startTime',
            render: date => <span>{date.toDateString()}</span>,
        },
        {
            title: '地点',
            dataIndex: 'place',
            key: 'place',
            render: place => <span>📍{place}</span>,
        },
    ];

    // 定义期刊列
    const journalCols = [
        {
            title: '期刊全称',
            dataIndex: 'fullTitle',
            key: 'fullTitle',
            render: (text, record) => <Link to={`/journalDetail/${record.journalId}`}>{text}</Link>,//点击全称 跳转到期刊详情页
        },
        {
            title: 'CCF',
            dataIndex: 'ccfRank',
            key: 'ccfRank',
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
            title: '截稿时间',
            dataIndex: 'paperDeadline',
            key: 'paperDeadline',
            render: date => <span>{date.toDateString()}</span>,
        },
        {
            title: '影响因子',
            dataIndex: 'impactFactor',
            key: 'impactFactor',
            render: impactFactor => <span>🎯{impactFactor}</span>,
        },
        {
            title: '出版社',
            dataIndex: 'publisher',
            key: 'publisher',
            render: publisher => <span>📚{publisher}</span>,
        },

    ];

    const [editing, setEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ userName: exampleUser.userName, email: exampleUser.email, institution: exampleUser.institution });

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



    return (
        <div className="flex-container">
            <div className="left-sidebar">
                <div className="basic-info">
                    <h3 className="info">📂 个人信息</h3>
                    <div className="avatar-container">
                        <div className="avatar">
                            <img src={exampleUser.imageUrl} alt="User Avatar" />
                        </div>
                    </div>
                    {editing ? (
                        <div className="edit-profile">
                            <Input type="text" name="userName" value={editedUser.userName}
                                onChange={handleChange}
                                placeholder="用户名" />
                            <Input type="text" name="email" value={editedUser.email}
                                onChange={handleChange} placeholder="邮箱" />
                            <Input type="text" name="institution" value={editedUser.institution}
                                onChange={handleChange} placeholder="科研机构" />
                            <Button type="primary"  onClick={handleSave}>保存</Button>
                        </div>
                    ) : (
                        <div>
                            <p>📝用户名：{exampleUser.userName}</p>
                            <p>📧邮箱: {exampleUser.email}</p>
                            <p>🏢科研机构: {exampleUser.institution}</p>
                            <Button type="primary" ghost onClick={handleEditClick}>
                                修改
                            </Button>
                        </div>
                    )}
                </div>

                <div className="follow-conference">
                    <h3 className="info">⭐ 收藏的会议</h3>
                    <div className="follow-list">
                        <Table columns={conferenceCol} dataSource={starConferences} style={{ margin: 16 }} />
                    </div>
                </div>

                <div className="attend-conference">
                    <h3 className="info">🧑‍💻 参加的会议</h3>
                    <div className="attend-list">
                        <Table columns={conferenceCol} dataSource={starConferences} style={{ margin: 16 }} />
                    </div>
                </div>

                <div className="follow-journal">
                    <h3 className="info">🧡 收藏的期刊</h3>
                    <div className="follow-list">
                        <Table columns={journalCols} dataSource={starJournals} style={{ margin: 16 }} />
                    </div>
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