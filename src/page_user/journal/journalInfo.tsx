//TODO： 展示全部CCF期刊
import React, { useState } from 'react';
import { Input, InputRef, Space, Button, Modal, Form, Table, Select, message } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { render } from '@testing-library/react';
import Journal from './journalType';
import { Link } from 'react-router-dom';



const journals: Journal[] = [
    {
        journalId: "IS",
        fullTitle: "Information Systems",
        ccfRank: "A",
        mainpageLink: "http://www.journals.elsevier.com/information-systems/",
        specialIssue: "Special Issue on Data Analytics",
        paperDeadline: new Date("2024-06-30"),
        impactFactor: 4.5,
        publisher: "Elsevier",
        followNum: 100
    },
];

const JournalInfo: React.FC = () => {
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
            title: 'Full Title',
            dataIndex: 'fullTitle',
            key: 'fullTitle',
            render: (text, record) => <Link to={`/journalDetail/${record.journalId}`}>{text}</Link> //点击全称 跳转到期刊详情页
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
                }

                return (
                    <span style={{ backgroundColor, padding: '5px', borderRadius: '5px' }}>{ccfRank}</span>
                );
            },
        },
        {
            title: 'Paper Deadline',
            dataIndex: 'paperDeadline',
            key: 'paperDeadline',
            render: date => <span>{date.toDateString()}</span>,
        },
        {
            title: 'Impact Factor',
            dataIndex: 'impactFactor',
            key: 'impactFactor',
            // render: date => <span>{date.toDateString()}</span>,
        },
        {
            title: 'Publisher',
            dataIndex: 'publisher',
            key: 'publisher',
            // render: date => <span>{date.toDateString()}</span>,
        },
        {
            title: 'Star',
            key: 'star',
            render: () => <HeartFilled style={{ color: 'red' }} />, // 收藏按钮
        }
    ];


    return (

        <div>
            <h3>CCF Journals</h3>
            <Table columns={columns} dataSource={journals} style={{ margin: 16 }} pagination={paginationProps} />
        </div>
    );
}

export default JournalInfo;