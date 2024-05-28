import React, { useState } from "react"
import { Conference } from "../../conference/conferenceType";
import { Link } from "react-router-dom";
import { Popconfirm, Space, Table } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';




const conferences: Conference[] = [
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
        endTime: new Date("2024-11-21"),
        acceptedRate: 0.22, // 添加接受率
        isPostponed: false
    },
];


const ConferenceManage: React.FC = () => {

    //分页默认值，记得import useState
    const [pageOption, setPageOption] = useState({
        pageNo: 1,  //当前页为1
        pageSize: 10, //一页10行
    })

    //分页配置
    const paginationProps = {
        current: pageOption.pageNo,
        pageSize: pageOption.pageSize,
        onChange: (current, size) => paginationChange(current, size)
    }

    //当翻页时，改变当前为第current页，current和size这两参数是onChange API自带的，会帮你算出来你现在在第几页，这一页有多少行数据。
    const paginationChange = async (current, size) => {
        //前面用到useState
        setPageOption({
            pageNo: current, //当前所在页面
            pageSize: size,  //一页有几行
        })
    }

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState(null);

    const handleDelete = () => {
        // 在这里调用删除接口
        console.log('调用删除接口');
        setDeleteModalVisible(false);
    };

    const handleEdit = () => {
        console.log('弹出编辑的表单？');
    }


    // 定义列
    const columns = [
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
            title: '年份',
            dataIndex: 'year',
            key: 'year',
            render: (year) => {
                let backgroundColor;
                if (year < 2024) {
                    backgroundColor = 'LightGrey'
                }

                else if (year = 2024) {
                    backgroundColor = 'LightCyan'
                }
                else {
                    backgroundColor = 'Lavender'
                }

                return <span style={{ backgroundColor, padding: '5px', borderRadius: '8px' }}>{year}</span>
            }
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
        {
            title: '接受率',
            dataIndex: 'acceptedRate',
            key: 'acceptedRate',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <EditOutlined style={{ color: 'CornflowerBlue' }} onClick={() => handleEdit()} />
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

    return (
        <div>
            <h3>CCF会议管理</h3>
            <Table columns={columns} dataSource={conferences} style={{ margin: 16 }} pagination={paginationProps} />
        </div>
    )

}


export default ConferenceManage