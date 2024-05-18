//TODO： 展示全部CCF会议
import React, { useState } from 'react';
import { Input, InputRef, Space, Button, Modal, Form, Table, Select, message } from 'antd';
import { Conference } from './conferenceType'
import { HeartFilled } from '@ant-design/icons';
import { render } from '@testing-library/react';



const conferences: Conference[] = [
    {
        conferenceId: "CIKM2024",
        title: "CIKM",
        fullTitle: "ACM International Conference on Information and Knowledge Management 2024",
        ccfRank: "B",
        sub: "Data",
        year: 2024,
        dblpLink: "", // 填入对应链接
        mainpageLink: "https://cikm2024.org/",
        place: "Boise, Idaho, USA",
        abstractDeadline: new Date("2024-05-13"),
        paperDeadline: new Date("2024-07-16"),
        startTime: new Date("2024-10-21"),
        followNum: 25, // 添加关注人数
        acceptedRate: 0.22, // 添加接受率
        sessionNum: 33,
        topicDetail: "Information retrieval in the era of LLMs,Open-ended QA systems, Fairness, Accountability, Transparency, Ethics, and Explainability in Information and Knowledge Management", // 填入主题细节
        isPostponed: false
    },
];



const ConferenceInfo: React.FC = () => {
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
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Full Title',
            dataIndex: 'fullTitle',
            key: 'fullTitle',
            render: (text, record) => <a href={record.mainpageLink}>{text}</a> //点击全称 跳转到主页
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
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            render: (year) => {
                let backgroundColor;
                if(year <  2024) {
                    backgroundColor = 'LightGrey'
                }

                else if (year = 2024) {
                    backgroundColor = 'LightCyan'
                }
                else{
                    backgroundColor = 'Lavender'
                }

                return <span style={{ backgroundColor, padding: '5px', borderRadius: '8px' }}>{year}</span>
            }
        },
        {
            title: 'Location',
            dataIndex: 'place',
            key: 'place',
        },
        {
            title: 'isPostponed',
            dataIndex: 'isPostponed',
            key: 'isPostponed',
            render: (isPostponed) => {
                if (isPostponed) { // 如果延期
                    return <span style={{ backgroundColor: 'red', padding: '5px', borderRadius: '5px' }}>延期</span>
                }
            }
        },
        {
            title: 'Abstract Deadline',
            dataIndex: 'abstractDeadline',
            key: 'abstractDeadline',
            render: date => <span>{date.toDateString()}</span>,
        },
        {
            title: 'Paper Deadline',
            dataIndex: 'paperDeadline',
            key: 'paperDeadline',
            render: date => <span>{date.toDateString()}</span>,
        },
        {
            title: 'Start Time',
            dataIndex: 'startTime',
            key: 'startTime',
            render: date => <span>{date.toDateString()}</span>,
        },
        {
            title: 'Session Number',
            dataIndex: 'sessionNum',
            key: 'sessionNum',
        },
        {
            title: 'Star',
            key: 'star',
            render: () => <HeartFilled style={{ color: 'red' }} />, // 收藏按钮
        }
    ];


    return (

        <div>
            <h3>CCF Conferences</h3>

            <Table columns={columns} dataSource={conferences} style={{ margin: 16 }} pagination={paginationProps} />
        </div>
    );
}

export default ConferenceInfo;