//期刊详情页面
import React, { useEffect, useState } from "react";
import { Button, Form, Input, List, Modal, Table, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UserComment, SingleComment } from "../conference/commentType.tsx";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { DetailJournal, Journal } from "./journalType.tsx";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";


type StarJournal = {
    journalId: string,
    ccfRank: string
}


const JournalDetail: React.FC = () => {

    const { id } = useParams(); // 获取路由参数
    console.log(id)
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin
    const token = userLogin.userInfo.data.token;
    const email = userLogin.userInfo.data.email;

    const [count, setCount] = useState(0)//负责页面更新

    const getRole = () => {
        let role = userInfo ? userInfo.data.username : null
        return role
    }
    const [journalDetail, setJournalDetail] = useState<DetailJournal>({
        journalId: "",
        ccfRank: "",
        sub: "",
        dblpLink: "",
        mainpageLink: "",
        followNum: 0,
        impactFactor: 0,
        citeScore: 0,
        publisher: "",
        topicDetails: ""
    });

    // 表示本页的期刊
    const [thisJournal, setThisJournal] = useState<StarJournal>({ journalId: "", ccfRank: "" });

    const [comments, setComments] = useState<UserComment[]>([]);
    const getComments = () => {
        //获取评论列表
        axios.get('http://124.220.14.106:9001/api/comments/' + id + '/comments', {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': "Bearer " + token
            },
        }).then(response => {
            console.log(response)
            setComments(response.data.data)
        }).catch(error => {
            console.log('Error', error.message);
        });
    }


    useEffect(() => {
        getComments();
        // 获取期刊详情
        axios.get('http://124.220.14.106:9001/api/journals/list/' + id + '/detail', {
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
                let journalDetail: DetailJournal = {
                    journalId: records.journalId,
                    sub: records.sub,
                    ccfRank: records.ccfRank,
                    dblpLink: records.dblpLink,
                    mainpageLink: records.mainpageLink,
                    followNum: records.followNum,
                    impactFactor: records.impactFactor,
                    citeScore: records.citeScore,
                    publisher: records.publisher,
                    topicDetails: records.topicDetails
                };
                setJournalDetail(journalDetail);
                // 本页期刊的实体
                setThisJournal({
                    journalId: records.journalId,
                    ccfRank: records.ccfRank
                });
            })
            .catch(error => {
                console.log('Error', error.message);
            });

        getStarList();
    }, [count]);

    const [isFollowed, setIsFollowed] = useState(false); // 初始状态设为未关注
    const [followJournals, setFollowJournals] = useState<StarJournal[]>([]);

    const getStarList = () => {
        // 获取用户收藏的期刊列表
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
                let followJournals: Journal[] = records.followJournals
                // 过滤掉 null 和 undefined
                setFollowJournals(followJournals.filter(item => item != null))
                // 判断是否已经收藏/参加了该会议
                const journalInFollowList = followJournals.some(journal => journal.journalId === id);
                setIsFollowed(journalInFollowList);
                console.log(isFollowed)
            })
            .catch(error => {
                console.log('Error', error.message);
            });
    }

    // 加入关注列表
    const addToFollowList = () => {
        const apiUrl = `http://124.220.14.106:9001/api/journals/${id}/follow/${isFollowed ? 'sub' : 'add'}`;
        axios.put(apiUrl, {
            email: email
        }, {
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': "Bearer " + token
            }
        }).then(response => {
            console.log(response);
            let data = response.data;
            if (data.code === 200) {
                // 更新关注状态
                setIsFollowed(!isFollowed);
                // 显示相应的消息
                Modal.success({
                    title: isFollowed ? '取消关注成功' : '关注成功',
                    content: isFollowed ? '您已成功取消关注。' : '您已成功关注！',
                });
                // 更新关注列表
                if (isFollowed) {
                    // 如果之前已经关注了，现在是取消关注
                    setFollowJournals(prev => prev.filter(j => j.journalId !== id));
                } else {
                    // 如果之前没有关注，现在是添加关注
                    // 将thisJournal加入列表
                    setFollowJournals(prev => [...prev, thisJournal]);
                }
            } else {
                Modal.error({
                    title: '操作失败',
                    content: '操作未能成功，请稍后重试。',
                });
            }
        }).catch(error => {
            console.error('Error:', error);
            Modal.error({
                title: '操作失败',
                content: '网络或服务器错误，请检查您的连接后再试。',
            });
        });
    }

    // 期刊收藏列表
    const followJournalCols = [
        {
            title: '📙期刊',
            dataIndex: 'journalId',
            key: 'journalId',
            align: 'center',
            render: (text, record) => (
                <Link to={`/journalDetail/${record.journalId}`} style={{ color: 'blue', fontWeight: 'bold' }}>
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

    const handleSubmitComment = (values: string) => {
        // 处理提交评论的逻辑
        console.log(values.comment);
        axios.get('http://124.220.14.106:9001/api/users/info', {
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': "Bearer " + token
            },
        }).then(response => {
            console.log(response)
            if (response.data.code === 200) {
                let record = response.data.data;
                axios.post('http://124.220.14.106:9001/api/comments/comment', {
                    userName: record.userName,
                    imageUrl: record.imageUrl,
                    commentTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                    content: values.comment,
                    category: 'Journal',
                    academicId: id,
                    parentId: -1,
                    replys: [],
                    parentComment: null,
                    parentUsername: null,
                    parentImageurl: null

                }, {
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': "Bearer " + token
                    },
                })
                    .then(response => {
                        console.log(response)
                        if (response.data.code === 200) {
                            message.success('评论成功！')
                            setCount(count + 1)
                        }
                    })

            }

        })
    };

    return (
        <div className="flex-container">
            <div className="left-sidebar">
                <div className="detail-card">
                    <h2>{journalDetail.journalId}</h2>
                    <p>💡 dblp: <a href={journalDetail.dblpLink} target="_blank">{journalDetail.dblpLink}</a></p>
                    <p>💡 期刊主页：<a href={journalDetail.mainpageLink} target="_blank">{journalDetail.mainpageLink}</a></p>
                    <p>📚 出版社：{journalDetail.publisher}</p>
                    <p>🪄 引用分数：{journalDetail.citeScore}</p>
                    <p>🎯 影响因子: {journalDetail.impactFactor} </p>
                    <p>🏆 CCF: <span style={{ backgroundColor: 'gold', padding: '5px', borderRadius: '5px', marginRight: '10px' }}>{journalDetail.ccfRank}</span>
                        {" "} 🌟 关注: {journalDetail.followNum} {"  "} </p>
                </div>
                <div className="call">
                    📢征稿
                </div>
                <div className="overview-card">
                    <text>
                        {journalDetail.topicDetails}
                    </text>

                </div>
                <div className="comment">
                    💭评论
                </div>
                <div className="comment-area">
                    <List
                        itemLayout="horizontal"
                        dataSource={comments}
                        renderItem={comment => <SingleComment comment={comment} />}
                    />
                </div>
                {getRole() === 'admin' ?
                    <div className="comment-input">
                    </div>
                    :
                    <div className="comment-input">
                        <Form onFinish={handleSubmitComment}>
                            <Form.Item name="comment">
                                <Input.TextArea rows={4} placeholder="写下你的评论..." />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    提交评论
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                }
            </div>
            {getRole() === 'admin' ?
                <div>
                </div>
                :
                <div className="right-sidebar">
                    <div className="personal-card">
                        <div className="follow-btn" onClick={addToFollowList}>
                            <span>{isFollowed ? '➖' : '➕'}</span>
                            <text>{isFollowed ? '取消关注' : '我要关注'}</text>
                        </div>
                    </div>
                    <div className="follow-card">
                        <div className="star-btn">
                            <span>🌟</span>
                            <text>期刊收藏列表</text>
                        </div>
                        <div>
                            {followJournals.length > 0 ? (
                                <div className="follow-list">
                                    <Table columns={followJournalCols} dataSource={followJournals}
                                        style={{ margin: 16 }} pagination={paginationProps} />
                                </div>
                            ) : (
                                <p style={{ textAlign: "center", marginTop: "20px" }}>您还没有关注任何期刊。</p> // 显示当列表为空时的消息
                            )}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};


export default JournalDetail