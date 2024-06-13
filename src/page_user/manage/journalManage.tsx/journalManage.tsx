import React, { useEffect, useRef, useState } from "react"
import { Table, Space, Popconfirm, Button, Form, Row, Input, Col, Select, Modal, InputRef, message } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import axios from "axios";
import { ColumnType } from "antd/es/table";
import { FilterConfirmProps } from "antd/es/table/interface";
import { useSelector } from "react-redux";
import { Journal } from "../../journal/journalType";
import Highlighter from 'react-highlight-words';



const { TextArea } = Input;
const { Option } = Select;
type DataIndex = keyof Journal;


const JournalManage: React.FC = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    console.log(userLogin)
    const token = userLogin.userInfo.data.token;
    const [journals, setJournals] = useState<Journal[]>([]);

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);

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


    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    // 定义列
    const journalCols = [
        {
            title: '📜期刊',
            dataIndex: 'journalId',
            key: 'journalId',
            align: 'center',
            ...getColumnSearchProps('journalId'), // 添加搜索
            render: (text, record) => <Link to={`/journalDetail/${record.journalId}`}>{text}</Link>,//点击全称 跳转到期刊详情页
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
            title: '🎯影响因子',
            dataIndex: 'impactFactor',
            key: 'impactFactor',
            align: 'center'
        },
        {
            title: '🪄引用分数',
            dataIndex: 'citeScore',
            key: 'citeScore',
            align: 'center'
        },
        {
            title: '📚出版社',
            dataIndex: 'publisher',
            key: 'publisher',
            align: 'center'
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <EditOutlined style={{ color: 'CornflowerBlue' }} onClick={() => handleEdit()} />
                    <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={() => { setDeleteModalVisible(true); handleDeleteJournal(record) }} // 确定则调用删除的接口
                        okText="确认"
                        cancelText="取消"
                    >
                        <DeleteOutlined style={{ color: 'red' }} />
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    /**删除会议 */
    const handleDeleteJournal = (record) => {
        // 在这里调用删除接口
        console.log('调用删除接口');
        setDeleteModalVisible(false);
        console.log('删除期刊：' + record);
        const id = record.journalId
        const apiUrl = `http://124.220.14.106:9001/api/journals/${id}`; // 删除接口
        axios.delete(apiUrl, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {

                if (response.data.code === 200) {
                    setDeleteModalVisible(false);
                    console.log('删除期刊成功', response);
                    message.success(id + '已删除成功！')
    
                    // 更新关注列表，移除已删除的会议
                    setJournals(journals.filter(journal => journal.journalId !== id));
                }
                else {
                    console.error('删除期刊失败:',);
                    // 可以显示错误消息提示用户操作失败
                    message.error(response.data.data)
                }

            })
            .catch(error => {
                console.error('删除期刊失败:', error);
                // 可以显示错误消息提示用户操作失败
                message.error('删除期刊未能成功，请稍后重试。')
            });
    };
    const handleEdit = () => {
        console.log('弹出编辑的表单？');
    }

    const handleAddJournal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values) => {
        axios.post('http://124.220.14.106:9001/api/journals', values, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 假设你的API使用Bearer token
            }
        }).then(response => {
            console.log(response.data)
            if (response.data.code == 200) {
                setIsModalVisible(false)
                console.log('添加期刊成功', response);
                message.success('添加期刊成功')
                // 更新关注列表，添加的会议
                setJournals(prevJournals => [...prevJournals, values]);
            }
            else {
                message.error(response.data.data)
            }
        })
            .catch(error => {
                console.error('添加期刊失败:', error);
                // 可以显示错误消息提示用户操作失败
                message.error('添加操作未能成功，请稍后重试。')
            });
        form.resetFields();
    };

    return (
        <>
            <h3>期刊管理</h3>
            <Button className="addRecord" type="primary" ghost onClick={handleAddJournal}>添加期刊</Button>
            <Table columns={journalCols} dataSource={journals} />
            <Modal title="添加期刊"
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
                {/* Your meeting form component goes here */}
                <Form form={form} layout="vertical">
                    <Form.Item name="journalId" label="期刊名称" rules={[{ required: true, message: '请输入期刊标题' }]}>
                        <Input />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={8}>
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
                        <Col span={8}>
                            <Form.Item name="sub" label="类型">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="publisher" label="出版社">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="dblplink" label="DBLP链接">
                        <Input />
                    </Form.Item>

                    <Form.Item name="mainpagelink" label="主页链接">
                        <Input />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="citeScore" label="引用分数">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="impactFactor" label="影响因子">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="topicDetails" label="期刊详情">
                        <TextArea rows={5} />
                    </Form.Item>

                </Form>
            </Modal>
        </>

    )

}

export default JournalManage