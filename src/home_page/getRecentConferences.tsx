//TODO： 展示全部CCF会议
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Conference } from '../page_user/conference/conferenceType';
import moment from 'moment';


const RecentConferences: React.FC = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    console.log(userLogin)
    const token = userLogin.userInfo.data.token;
    const [recentConferences, setRecentConferences] = useState<Conference[]>([]);
    console.log(token)
    useEffect(() => {
        axios.get('http://124.220.14.106:9001/api/conferences/recentList', {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': "Bearer " + token
            },
        })
            .then(response => {
                console.log(response);
                let data = response.data;
                console.log(data)
                let records = data.data;
                console.log(records)
                let conferenceTmp: Conference[] = [];
                for (let i = 0; i < records.length; i++) {
                    conferenceTmp.push({
                        conferenceId: records[i].conferenceId,
                        fullTitle: records[i].fullTitle,
                        ccfRank: records[i].ccfRank,
                        sub: records[i].sub,
                        mainpageLink: records[i].mainpageLink,
                        abstractDeadline: records[i].abstractDeadline, //摘要DDL
                        paperDeadline: records[i].paperDeadline,//全文DDL
                        startTime: records[i].startTime, //开始时间'
                        endTime: records[i].endTime,  //结束时间
                        acceptedRate: records[i].acceptedRate, //接受率
                        place: records[i].place,
                        isPostponed: records[i].isPostponed// 是否延期
                    });
                }
                setRecentConferences(conferenceTmp);
                console.log(conferenceTmp)
            })
            .catch(error => {
                console.log('Error', error.message);
            });
    }, []);

    // 在只有一页的情况下隐藏分页器
    const paginationProps = {
        hideOnSinglePage: true
    }

    // 近期会议列
    const recentConfCol = [
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
        }
    ];


    return (
        <Table columns={recentConfCol} dataSource={recentConferences}
            style={{ margin: 16 }} pagination={paginationProps} />
    );
}

export default RecentConferences;