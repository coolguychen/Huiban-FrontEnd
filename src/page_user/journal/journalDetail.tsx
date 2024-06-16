//期刊详情页面
import React, { useEffect, useState } from "react";
import { Button, List, Modal, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UserComment, SingleComment } from "../conference/commentType.tsx";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { DetailJournal, Journal } from "./journalType.tsx";
import axios from "axios";
import { Link } from "react-router-dom";


const comments = [
    {
        id: 6,
        userName: "chm",
        imageUrl: "https://iconfont.alicdn.com/p/illus/preview_image/1SAIt26l6ecK/9dd5ffa2-becc-4088-9f34-e92e332e6186.png",
        commentTime: "2024-05-22T12:13:47.000+00:00",
        content: "审了7长3短，审CIKM工作量确实非常大，六月底一整周最主要的工作就是审CIKM了。\nbidding机制不清楚，每年都会分到一些和我相关性不大的文章，硬着头皮慢慢看，当做拓展知识了，不过有可能造成审稿质量下降的隐患。平均审稿质量看起来还可以，看得出大部分PC member是认真看了文章后才写的。个别也有不认真的审稿人review不专业，例如说说套话就拒，或者不了解领域盲目给高分，基本都在PC和SPC 的discussion中改善了。\n投稿质量，完全瞎投碰运气的稿子比较少。我是对所有文章都粗读一遍后，有个大致对比后再逐篇细读挑问题。大家都很会包装，以至于我第一轮读完，总体感觉每篇都有亮点。不过再细看每一篇，其实都有明显的逻辑漏洞，因为逻辑上的问题被拒不怨。总的来说，CIKM是个正经好会，要保证自己工作没有明显逻辑漏洞才有希望录用。",
        category: "conference",
        academicId: "date2023",
        parentId: undefined,
        replys: [],
        parentComment: null,
        parentUsername: null,
        parentImageUrl: null
    },
    // Add more comments as needed
    {
        id: 6,
        userName: "dzq",
        imageUrl: "https://iconfont.alicdn.com/p/illus/preview_image/1SAIt26l6ecK/9dd5ffa2-becc-4088-9f34-e92e332e6186.png",
        commentTime: "2024-05-22T12:13:47.000+00:00",
        content: "评分：1 -1 -1 \n今年可能是因为稿件量太大了，我遇到的审稿人质量比较差。1. 我做的是序列推荐，居然有一个审稿人要我和 CTR 的 Baseline 做对比，他还强调，不这样的话没有说服力…2. 还有一个审稿人，要求我加基线方法，然后挂了两个 arxiv 链接，都是23年6月的，CIKM六月都截稿了…审稿质量差的我心服口服…",
        category: "conference",
        academicId: "date2023",
        parentId: undefined,
        replys: [],
        parentComment: null,
        parentUsername: null,
        parentImageUrl: null
    },
    {
        id: 6,
        userName: "cyh",
        imageUrl: "https://iconfont.alicdn.com/p/illus/preview_image/1SAIt26l6ecK/9dd5ffa2-becc-4088-9f34-e92e332e6186.png",
        commentTime: "2024-05-22T12:13:47.000+00:00",
        content: "1 1 -1 long paper accept\n审稿意见还比较中肯\n坏消息是可能没法去现场，线下参会太贵了（太穷了）",
        category: "conference",
        academicId: "date2023",
        parentId: undefined,
        replys: [],
        parentComment: null,
        parentUsername: null,
        parentImageUrl: null
    },
];

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

    useEffect(() => {
        // 获取会议详情
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
    }, []);

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

    const submitComment = (value: string) => {
        // 处理提交评论的逻辑
        console.log(value);
    };

    return (
        <div className="flex-container">
            <div className="left-sidebar">
                <div className="detail-card">
                    <h2>{journalDetail.journalId}</h2>
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
                        <TextArea rows={4} placeholder="写下你的评论..." />
                        <Button type="primary" onClick={() => submitComment("新评论")}>
                            提交
                        </Button>
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