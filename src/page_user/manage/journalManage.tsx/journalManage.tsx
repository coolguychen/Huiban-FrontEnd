import React, { useState } from "react"
import { Table, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import Journal from "../../journal/journalType";
import { Link } from "react-router-dom";

const journalData: Journal[] = [
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

const JournalManage: React.FC = () => {
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

    // 定义列
    const columns = [
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
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
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


    return (
        <>
            <h3>CCF期刊管理</h3>
            <Table columns={columns} dataSource={journalData} />
        </>

    )

}

export default JournalManage