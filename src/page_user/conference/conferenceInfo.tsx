//TODO： 展示全部CCF会议
import React, { useEffect, useRef, useState } from 'react';
import { Input, InputRef, Space, Button, Table, Form, DatePicker, message, Tag } from 'antd';
import { Conference } from './conferenceType'
import { SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';


// type DataIndex = keyof Conference;

const ConferenceInfo: React.FC = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    console.log(userLogin)
    const token = userLogin.userInfo.data.token;
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [initialConferences, setInitial] = useState<Conference[]>([]);

    console.log(token)
    useEffect(() => {
        axios.get('http://124.220.14.106:9001/api/conferences/list', {
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
                        isPostponed: records[i].postponed// 是否延期
                    });
                }
                setConferences(conferenceTmp);
                setInitial(conferenceTmp)
                console.log(conferenceTmp)
            })
            .catch(error => {
                console.log('Error', error.message);
            });
    }, []);

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

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`搜索 ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        搜索
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        重置
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    // 定义列
    const conferenceCols = [
        {
            title: '📙简称',
            dataIndex: 'conferenceId',
            key: 'conferenceId',
            align: 'center',
            ...getColumnSearchProps('conferenceId'), // 添加搜索
            render: (text, record) => (
                <Link to={`/conferenceDetail/${record.conferenceId}`} style={{ color: 'blue', fontWeight: 'bold' }}>
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                </Link>
            ),
        },
        {
            title: '📖全称',
            dataIndex: 'fullTitle',
            key: 'fullTitle',
            align: 'center',
            ...getColumnSearchProps('fullTitle'), // 添加搜索
            render: (text, record) => (
                <a href={record.mainpageLink} target='_blank'>
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                </a>
            ),
        },
        {
            title: '🏷️类型',
            dataIndex: 'sub',
            key: 'sub',
            align: 'center',
            filters: [
                {
                    text: '计算机体系结构/并行与分布计算/存储系统',
                    value: '计算机体系结构/并行与分布计算/存储系统'
                },
                {
                    text: '计算机网络',
                    value: '计算机网络',
                },
                {
                    text: '网络与信息安全',
                    value: '网络与信息安全',
                },
                {
                    text: '软件工程/系统软件/程序设计语言',
                    value: '软件工程/系统软件/程序设计语言',
                },
                {
                    text: '数据库/数据挖掘/信息检索',
                    value: '数据库/数据挖掘/信息检索',
                },
                {
                    text: '计算机科学理论',
                    value: '计算机科学理论',
                },
                {
                    text: '计算机图形学与多媒体',
                    value: '计算机图形学与多媒体',
                },
                {
                    text: '人工智能',
                    value: '人工智能',
                },
                {
                    text: '人机交互与普适计算',
                    value: '人机交互与普适计算',
                },
                {
                    text: '跨学科/混合/新兴领域',
                    value: '跨学科/混合/新兴领域',
                },
            ],
            onFilter: (value, record) => record.sub === value,
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
                    return <Tag color='red'>延期</Tag>
                    // <span style={{ backgroundColor: 'red', padding: '5px', borderRadius: '5px' }}>延期</span>
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
            sorter: (a, b) => {
                const dateA = a.startTime ? moment(new Date(a.startTime)).format('YYYY-MM-DD') : '';
                const dateB = b.startTime ? moment(new Date(b.startTime)).format('YYYY-MM-DD') : '';
                return dateA.localeCompare(dateB, undefined, { numeric: true });
            },
            render: (date) => date && <span>{moment(new Date(date)).format('YYYY-MM-DD')}</span>,
        },
        {
            title: '📆结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            align: 'center',
            sorter: (a, b) => {
                const dateA = a.endTime ? moment(new Date(a.endTime)).format('YYYY-MM-DD') : '';
                const dateB = b.endTime ? moment(new Date(b.endTime)).format('YYYY-MM-DD') : '';
                return dateA.localeCompare(dateB, undefined, { numeric: true });
            },
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
            sorter: (a, b) => {
                if (a.acceptedRate === null || a.acceptedRate === undefined) return 1;
                if (b.acceptedRate === null || b.acceptedRate === undefined) return -1;
                return a.acceptedRate - b.acceptedRate;
            },
            render: acceptedRate => acceptedRate ? <span>{acceptedRate * 100 + '%'}</span> : <></>
        }
    ];

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // 假设的筛选函数
    const filterData = (start, end) => {
        return conferences.filter(item => {
            const startTime = new Date(item.startTime)
            const endTime = new Date(item.endTime)
            // console.log(startTime)
            // console.log(endTime)
            return (
                (!start || startTime >= start) &&
                (!end || endTime <= end)
            );
        });
    };

    const handleDateChange = (field, value) => {
        console.log(value);
        let newDate = value; // 将日期字符串转换为Date对象
        // 检查日期有效性
        if (field === 'startDate') {
            if (endDate && newDate >= endDate) {
                alert('结束日期不能小于开始日期！');
                return; // 如果开始日期大于结束日期，不更新状态并退出函数
            }
            setStartDate(value);
            console.log(value);
        } else if (field === 'endDate') {
            if (newDate < startDate) {
                message.error('结束日期不能小于开始日期！');
                return;
            }
            setEndDate(value);
            console.log(endDate);
        }
        // 重新筛选数据
        const filteredData = filterData(startDate, endDate);
        setConferences(filteredData);
    };

    return (
        <div>
            <h3 className='info'>CCF Conferences</h3>
            <div>
                <Form className='filter-right' layout="inline">
                    <Form.Item label="开始时间">
                        <DatePicker
                            value={startDate}
                            onChange={(value) => handleDateChange('startDate', value)}
                        />
                    </Form.Item>
                    <Form.Item label="结束时间">
                        <DatePicker
                            value={endDate}
                            onChange={(value) => handleDateChange('endDate', value)}
                        />
                    </Form.Item>
                    <Form.Item >
                        <Button type="primary" onClick={() => setConferences(filterData(startDate, endDate))}>
                            筛选
                        </Button>
                        <Button style={{ marginLeft: "10px" }} type="primary" ghost onClick={() => setConferences(initialConferences)}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
                <Table columns={conferenceCols} dataSource={conferences} style={{ margin: 16 }} pagination={paginationProps} />
            </div>
        </div>
    );
}

export default ConferenceInfo;