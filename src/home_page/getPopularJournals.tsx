//TODO： 展示全部CCF期刊
import React, { useEffect, useState } from 'react';
import { Table, } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';


interface popJournal {
    journalId: string,
    followNum: number
}

const PopularJournals: React.FC = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    console.log(userLogin)
    // const token = userLogin.userInfo.data.token;
    const [journals, setJournals] = useState<popJournal[]>([]);
    // console.log(token)
    useEffect(() => {
        axios.get('http://124.220.14.106:9001/api/journals/popularList', {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                // 'Authorization': "Bearer " + token
            },
        })
            .then(response => {
                console.log(response);
                let data = response.data;
                console.log(data)
                let records = data.data;
                console.log(records)
                let journalTmp: popJournal[] = [];
                for (let i = 0; i < records.length; i++) {
                    journalTmp.push({
                        journalId: records[i].journalId,
                        followNum: records[i].followNum,
                    });
                }
                setJournals(journalTmp);
                console.log(journalTmp)
            })
            .catch(error => {
                console.log('Error', error.message);
            });
    }, []);

    // 在只有一页的情况下隐藏分页器
    const paginationProps = {
        hideOnSinglePage: true
    }

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
            title: '🤩关注人数',
            dataIndex: 'followNum',
            key: 'followNum',
            align: 'center',
        }
    ];

    return (
        <Table columns={journalCols} dataSource={journals} style={{ margin: 16 }} pagination={paginationProps} />
    );
}

export default PopularJournals;