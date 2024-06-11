import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { Conference } from '../page_user/conference/conferenceType';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { User } from '../page_user/user/userType';

const StarList: React.FC = () => {

    const userLogin = useSelector((state: any) => state.userLogin)
    const token = userLogin.userInfo.data.token;

    //记录收藏会议列表
    const [starConferences, setStarConferences] = useState<Conference[]>([]);
    // 获取用户信息
    useEffect(() => {
        getFollowedConferences()
    }, []);

    const getFollowedConferences = () => {
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
                // 过滤掉 null 和 undefined，然后设置状态
                setStarConferences(userDataTmp.followConferences.filter(item => item != null));
            })
            .catch(error => {
                console.log('Error', error.message);
            });
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
    ];

    // 表格单页时隐藏分页器
    const paginationProps = {
        hideOnSinglePage: true
    }


    return (
        <>
            <div className="follow-list">
                <Table columns={conferenceCols} dataSource={starConferences}
                    style={{ margin: 16 }} pagination={paginationProps} />
            </div>

        </>
    )
}

export default StarList