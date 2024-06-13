import React, { useEffect, useRef, useState } from "react"
import { Conference } from "../../conference/conferenceType";
import { Link } from "react-router-dom";
import { Button, Col, DatePicker, Form, Input, InputNumber, InputRef, Modal, Popconfirm, Row, Select, Space, Table, message } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import moment from "moment";
import { } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { ColumnType, FilterConfirmProps } from 'antd/es/table/interface';
import { useSelector } from 'react-redux';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;
type DataIndex = keyof Conference;

const ConferenceManage: React.FC = () => {
    /** 管理员信息 */
    const userLogin = useSelector((state: any) => state.userLogin)
    console.log(userLogin)
    const token = userLogin.userInfo.data.token;
    const [conferences, setConferences] = useState<Conference[]>([]);

    /**获取全部会议 */
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
                        isPostponed: records[i].isPostponed// 是否延期
                    });
                }
                setConferences(conferenceTmp);
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

    /**编辑与删除操作 */
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    /**删除会议 */
    const handleDeleteConference = (record) => {
        // 在这里调用删除接口
        console.log('调用删除接口');
        setDeleteModalVisible(false);
        console.log('删除会议：' + record);
        const id = record.conferenceId
        const apiUrl = `http://124.220.14.106:9001/api/conferences/${id}`; // 删除接口
        axios.delete(apiUrl, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.data.code === 200) {
                    console.log('删除会议成功', response);
                    message.success(id + '已删除成功！')
                    // 更新关注列表，移除已删除的会议
                    setConferences(conferences.filter(conference => conference.conferenceId !== id));
                }
                else {
                    message.error(response.data.data)
                }
            })
            .catch(error => {
                console.error('删除会议失败:', error);
                // 可以显示错误消息提示用户操作失败
                message.error('删除操作未能成功，请稍后重试。')
            });

    };

    const handleEdit = () => {
        console.log('弹出编辑的表单？');
    }

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleAddConference = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values) => {
        console.log(values)
        // 从ISO日期字符串中提取年份
        const year = values.year.year();
        console.log(year)
        if (values.conferenceId && values.year !== undefined) {
            values.year = year
            values.conferenceId = `${values.conferenceId}${values.year}`;
        }
        // onCreate(values);
        // 使用axios发送POST请求
        axios.post('http://124.220.14.106:9001/api/conferences', values, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 假设你的API使用Bearer token
            }
        }).then(response => {
            console.log(response.data)
            if (response.data.code == 200) {
                setIsModalVisible(false)
                console.log('添加会议成功', response);
                message.success('添加会议成功！')
                // 更新关注列表，添加的会议
                setConferences(prevConferences => [...prevConferences, values]);
            }
            else {
                message.error(response.data.data)
            }
        })
            .catch(error => {
                console.error('添加会议失败:', error);
                // 可以显示错误消息提示用户操作失败
                message.error('添加操作未能成功，请稍后重试。')
            });
        form.resetFields();
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
            title: '📖全称',
            dataIndex: 'fullTitle',
            key: 'fullTitle',
            align: 'center',
            ...getColumnSearchProps('fullTitle'), // 添加搜索
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
            render: acceptedRate => acceptedRate ? <span>{acceptedRate * 100 + '%'}</span> : <></>
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <EditOutlined style={{ color: 'CornflowerBlue' }} onClick={() => handleEdit()} />
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => { handleDeleteConference(record) }} // 确定则调用删除的接口
                        okText="确认"
                        cancelText="取消"
                    >
                        <DeleteOutlined style={{ color: 'red' }} />
                    </Popconfirm>


                </Space>
            ),
        },
    ];

    return (
        <div>
            <h3>会议管理</h3>
            <Button className="addRecord" type="primary" ghost onClick={handleAddConference}>添加会议</Button>
            <Modal title="添加会议"
                open={isModalVisible}
                okText="添加"
                cancelText="取消"
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            form.resetFields();
                            handleSubmit(values);
                        })
                        .catch((info) => {
                            console.log('Validation failed:', info);
                        });
                }}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item name="conferenceId" label="简称" rules={[{ required: true, message: '请输入会议标题' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="year" label="年份" rules={[{ required: true }]}>
                                <DatePicker picker="year" />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="session" label="届数" >
                                <InputNumber min={0} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="ccfRank" label="CCF 排名" rules={[{ required: true, message: '请选择CCF排名' }]}>
                                <Select>
                                    <Option value="">请选择</Option>
                                    <Option value="A">A</Option>
                                    <Option value="B">B</Option>
                                    <Option value="C">C</Option>
                                    <Option value="null">NULL</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="fullTitle" label="全称">
                        <Input />
                    </Form.Item>
                    <Form.Item name="dblplink" label="DBLP链接">
                        <Input />
                    </Form.Item>
                    <Form.Item name="mainpagelink" label="主页链接">
                        <Input />
                    </Form.Item>
                    <Form.Item name="place" label="开会地址">
                        <Input />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="acceptedRate" label="接受率">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="sub" label="类型">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="abstractDeadline" label="摘要截止时间">
                                <DatePicker showTime />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="paperDeadline" label="论文截止时间">
                                <DatePicker showTime />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="startTime" label="会议开始时间">
                                <DatePicker showTime />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="endTime" label="会议结束时间">
                                <DatePicker showTime />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="topicDetails" label="会议详情">
                        <TextArea rows={5} />
                    </Form.Item>
                </Form>
            </Modal>
            <Table columns={conferenceCols} dataSource={conferences} style={{ margin: 16 }} pagination={paginationProps} />
        </div>
    )
}

export default ConferenceManage