//TODO： 展示全部CCF会议
import React, { useRef, useState } from 'react';
import { Input, InputRef, Space, Button, Modal, Form, Table, Select, message } from 'antd';
import { Conference } from './conferenceType'
import { SearchOutlined, HeartFilled } from '@ant-design/icons';
import { render } from '@testing-library/react';
import { Link } from 'react-router-dom';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';



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
        acceptedRate: 0.22, // 添加接受率
        isPostponed: false
    },
];


type DataIndex = keyof Conference;

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

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };


    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Conference> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        搜索
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        重置
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        关闭
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: 'gold', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

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
            ...getColumnSearchProps('fullTitle'), // 添加搜索
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
        }
    ];


    return (

        <div>
            <h3 className='info'>CCF Conferences</h3>
            <Table columns={columns} dataSource={conferences} style={{ margin: 16 }} pagination={paginationProps} />
        </div>
    );
}

export default ConferenceInfo;