//TODO： 展示全部CCF会议
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

interface popConference {
    conferenceId: string,
    followNum: number
}

const PopularConferences: React.FC = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    console.log(userLogin)
    const token = userLogin.userInfo.data.token;
    const [popConferences, setPopConferences] = useState<popConference[]>([]);
    console.log(token)
    useEffect(() => {
        axios.get('http://124.220.14.106:9001/api/conferences/popularList', {
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
                let conferenceTmp: popConference[] = [];
                for (let i = 0; i < records.length; i++) {
                    conferenceTmp.push({
                        conferenceId: records[i].conferenceId,
                        followNum: records[i].followNum,
                    });
                }
                setPopConferences(conferenceTmp);
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

    // 定义热门会议列
    const popularConfCol = [
        {
            title: '📙会议',
            dataIndex: 'conferenceId',
            key: 'conferenceId',
            align: 'center',
            render: (text, record) => (
                <Link to={`/conferenceDetail/${record.conferenceId}`}>
                    {text}
                </Link>
            ),
        },
        {
            title: '🤩关注人数',
            dataIndex: 'followNum',
            key: 'followNum',
            align: 'center',
        }
    ];

    return (
        <Table columns={popularConfCol} dataSource={popConferences}
            style={{ margin: 16 }} pagination={paginationProps} />
    );
}

export default PopularConferences;