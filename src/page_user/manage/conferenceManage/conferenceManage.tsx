import React, { useEffect, useRef, useState } from "react"
import { Conference, EditConference } from "../../conference/conferenceType";
import { Link } from "react-router-dom";
import { Button, Col, DatePicker, Form, Input, InputNumber, InputRef, Modal, Popconfirm, Row, Select, Space, Switch, Table, Tag, message } from 'antd';
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
    const [initialConferences, setInitial] = useState<Conference[]>([]);
    const [count, setCount] = useState(0)//负责页面更新

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
    }, [count]);

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

    /** 编辑会议 */
    const [editConferenceForm, setEditConferenceForm] = useState(false);
    interface CollectionEditFormProps {
        open: boolean;
        record: EditConference;
        onCancel: () => void;
    }

    const [editRecord, setEditRecord] = useState<EditConference>();


    const EditConferenceForm: React.FC<CollectionEditFormProps> = ({
        open,
        record,
        onCancel,
    }) => {
        const [form] = Form.useForm();

        if (record) {
            console.log(record)
            form.setFieldsValue({
                title: record.title,
                fullTitle: record.fullTitle,
                ccfRank: record.ccfRank,
                sub: record.sub,
                year: moment(record.year, 'YYYY'),
                dblpLink: record.dblpLink,
                mainpageLink: record.mainpageLink,
                place: record.place,
                abstractDeadline: moment(record.abstractDeadline, 'YYYY-MM-DD'), //摘要DDL
                paperDeadline: moment(record.paperDeadline, 'YYYY-MM-DD'),//全文DDL
                startTime: moment(record.startTime, 'YYYY-MM-DD'), //开始时间'
                endTime: moment(record.endTime, 'YYYY-MM-DD'),  //结束时间
                sessionNum: record.sessionNum,
                topicDetails: record.topicDetails,
                acceptedRate: record.acceptedRate,
                postponed: record.isPostponed
            })
        }
        return (
            //用Modal弹出表单
            <Modal
                open={open} //是
                title="修改会议信息"
                okText="确定"
                cancelText="取消"
                onCancel={onCancel}
                width={800}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            const year = values.year.year();
                            console.log(year)
                            values.year = year
                            values.conferenceId = `${values.title}${values.year}`;
                            values.title = values.fullTitle

                            console.log(values)
                            form.resetFields();
                            const apiUrl = 'http://124.220.14.106:9001/api/conferences/update'; // 会议信息更新接口
                            console.log(values)
                            axios.put(apiUrl, values, {
                                headers: {
                                    'Content-Type': 'application/json; charset=UTF-8',
                                    'Authorization': `Bearer ${token}`
                                }
                            })
                                .then((response) => {
                                    console.log(response)
                                    if (response.data.code === 200) {
                                        console.log(response)
                                        message.success('修改成功！')
                                        setEditConferenceForm(false);
                                        setCount(count + 1)
                                    } else {
                                        message.error('修改失败，请稍后再试！')
                                        setEditConferenceForm(false);
                                    }
                                })
                                .catch((err) => {
                                    console.log(err.message);
                                    message.error('修改失败，请稍后再试！')
                                });
                        })
                        .catch((info) => {
                            console.log('Validate Failed:', info);
                        });
                }}
            >
                <Form form={form} layout="horizontal" name="form_in_modal"
                >
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item name="title" label="简称" >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="year" label="年份" >
                                <DatePicker picker="year" disabled />
                                {/* <Input /> */}
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="sessionNum" label="届数" >
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
                    <Form.Item name="dblpLink" label="DBLP链接">
                        <Input />
                    </Form.Item>
                    <Form.Item name="mainpageLink" label="主页链接">
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
                                <Select>
                                    <Select.Option value="计算机体系结构/并行与分布计算/存储系统">计算机体系结构/并行与分布计算/存储系统</Select.Option>
                                    <Select.Option value="计算机网络">计算机网络</Select.Option>
                                    <Select.Option value="网络与信息安全">网络与信息安全</Select.Option>
                                    <Select.Option value="软件工程/系统软件/程序设计语言">软件工程/系统软件/程序设计语言</Select.Option>
                                    <Select.Option value="数据库/数据挖掘/信息检索">数据库/数据挖掘/信息检索</Select.Option>
                                    <Select.Option value="计算机科学理论">计算机科学理论</Select.Option>
                                    <Select.Option value="计算机图形学与多媒体">计算机图形学与多媒体</Select.Option>
                                    <Select.Option value="人工智能">人工智能</Select.Option>
                                    <Select.Option value="人机交互与普适计算">人机交互与普适计算</Select.Option>
                                    <Select.Option value="跨学科/混合/新兴领域">跨学科/混合/新兴领域</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="postponed" label="是否延期" valuePropName="checked">
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
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
        )
    };

    const handleEdit = (record) => {
        console.log('弹出编辑的表单？');
        console.log(record)
        axios.get('http://124.220.14.106:9001/api/conferences/list/' + record.conferenceId + '/detail', {
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
                let conferenceTmp: EditConference = {
                    conferenceId: records.conferenceId,
                    title: records.conferenceId.substring(0, records.conferenceId.length - 4),
                    fullTitle: records.fullTitle,
                    ccfRank: records.ccfRank,
                    sub: record.sub,
                    year: records.conferenceId.substring(records.conferenceId.length - 4), //年份
                    dblpLink: records.dblpLink,
                    mainpageLink: records.mainpageLink,
                    place: record.place,
                    abstractDeadline: records.abstractDeadline, //摘要DDL
                    paperDeadline: records.paperDeadline,//全文DDL
                    startTime: records.startTime, //开始时间'
                    endTime: records.endTime,  //结束时间
                    followNum: records.followNum,
                    attendNum: records.attendNum,
                    sessionNum: records.sessionNum,
                    topicDetails: records.topicDetails,
                    acceptedRate: record.acceptedRate,
                    isPostponed: records.postponed
                };
                setEditRecord(conferenceTmp)

            })
            .catch(error => {
                console.log('Error', error.message);
            });

        setEditConferenceForm(true)
    }


    /**增加会议 */
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
        if (values.title && values.year !== undefined) {
            values.year = year
            values.conferenceId = `${values.title}${values.year}`;
        }
        // 使用axios发送POST请求
        axios.post('http://124.220.14.106:9001/api/conferences', values, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 假设你的API使用Bearer token
            }
        }).then(response => {
            console.log(response.data)
            if (response.data.code === 200) {
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
            render: date => date && <span>{moment(new Date(date)).format('YYYY-MM-DD')}</span>
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
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space>
                    <EditConferenceForm
                        open={editConferenceForm}
                        record={editRecord}
                        onCancel={() => {
                            setEditConferenceForm(false);
                        }} />
                    <EditOutlined style={{ color: 'CornflowerBlue' }} onClick={() => handleEdit(record)} />
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
                width={800}
            >
                <Form form={form} layout="horizontal">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Form.Item name="title" label="简称" rules={[{ required: true, message: '请输入会议标题' }]}>
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
                    <Form.Item name="dblpLink" label="DBLP链接">
                        <Input />
                    </Form.Item>
                    <Form.Item name="mainpageLink" label="主页链接">
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
                                <Select>
                                    <Select.Option value="计算机体系结构/并行与分布计算/存储系统">计算机体系结构/并行与分布计算/存储系统</Select.Option>
                                    <Select.Option value="计算机网络">计算机网络</Select.Option>
                                    <Select.Option value="网络与信息安全">网络与信息安全</Select.Option>
                                    <Select.Option value="软件工程/系统软件/程序设计语言">软件工程/系统软件/程序设计语言</Select.Option>
                                    <Select.Option value="数据库/数据挖掘/信息检索">数据库/数据挖掘/信息检索</Select.Option>
                                    <Select.Option value="计算机科学理论">计算机科学理论</Select.Option>
                                    <Select.Option value="计算机图形学与多媒体">计算机图形学与多媒体</Select.Option>
                                    <Select.Option value="人工智能">人工智能</Select.Option>
                                    <Select.Option value="人机交互与普适计算">人机交互与普适计算</Select.Option>
                                    <Select.Option value="跨学科/混合/新兴领域">跨学科/混合/新兴领域</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="postponed" label="是否延期" valuePropName="checked">
                        <Switch checkedChildren="是" unCheckedChildren="否" />
                    </Form.Item>
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
                    <Form.Item>
                        <Button type="primary" onClick={() => setConferences(filterData(startDate, endDate))}>
                            筛选
                        </Button>
                        <Button style={{ marginLeft: "10px" }} type="primary" ghost onClick={() => setConferences(initialConferences)}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
                <Table columns={conferenceCols} dataSource={conferences} style={{ margin: 16 }} pagination={paginationProps} />            </div>
            {/* <Table columns={conferenceCols} dataSource={conferences} style={{ margin: 16 }} pagination={paginationProps} /> */}
        </div>
        // <Table columns={conferenceCols} dataSource={conferences} style={{ margin: 16 }} pagination={paginationProps} />
    )
}

export default ConferenceManage