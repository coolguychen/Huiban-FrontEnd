//TODO： 展示全部CCF期刊
import React, { useEffect, useRef, useState } from 'react';
import { Input, InputRef, Space, Button, Table, Tag, } from 'antd';
import { HeartFilled } from '@ant-design/icons';
import { SearchOutlined, } from '@ant-design/icons';
import { render } from '@testing-library/react';
import Journal from './journalType';
import { Link } from 'react-router-dom';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';


type DataIndex = keyof Journal;

const JournalInfo: React.FC = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    console.log(userLogin)
    const token = userLogin.userInfo.data.token;
    const [journals, setJournals] = useState<Journal[]>([]);
    console.log(token)
    useEffect(() => {
        axios.get('http://124.220.14.106:9001/api/journals/list', {
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
                let journalTmp: Journal[] = [];
                for (let i = 0; i < records.length; i++) {
                    journalTmp.push({
                        journalId: records[i].journalId,
                        ccfRank: records[i].ccfRank,
                        sub: records[i].sub,
                        publisher: records[i].publisher,
                        citeScore: records[i].citeScore,
                        impactFactor: records[i].impactFactor
                    });
                }
                setJournals(journalTmp);
                console.log(journalTmp)
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

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Journal> => ({
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
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (text),
    });

    // 定义列
    const journalCols = [
        {
            title: '📜期刊',
            dataIndex: 'journalId',
            key: 'journalId',
            align: 'center',
            ...getColumnSearchProps('journalId'), // 添加搜索
            // 跳转至期刊详情
            render: (text, record) => (
                <Link to={`/journalDetail/${record.journalId}`}>
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
            title: '🎯影响因子',
            dataIndex: 'impactFactor',
            key: 'impactFactor',
            align: 'center',
            sorter: (a, b) => a.impactFactor - b.impactFactor,
        },
        {
            title: '🪄引用分数',
            dataIndex: 'citeScore',
            key: 'citeScore',
            align: 'center',
            sorter: (a, b) => a.citeScore - b.citeScore,
        },
        {
            title: '📚出版社',
            dataIndex: 'publisher',
            key: 'publisher',
            align: 'center'
        },
    ];

    return (

        <div>
            <h3 className='info'>CCF Journals</h3>
            <Table columns={journalCols} dataSource={journals} style={{ margin: 16 }} pagination={paginationProps} />
        </div>
    );
}

export default JournalInfo;