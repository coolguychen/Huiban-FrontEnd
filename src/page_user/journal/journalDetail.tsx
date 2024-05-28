//期刊详情页面
import React from "react";
import { Button, List } from "antd";
import TextArea from "antd/es/input/TextArea";
import SingleComment from "../conference/commentType.tsx";


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

const JournalDetail: React.FC = () => {

    const submitComment = (value: string) => {
        // 处理提交评论的逻辑
        console.log(value);
    };

    return (
        <div className="flex-container">
            <div className="left-sidebar">

                <div className="detail-card">
                    <h2>CIKM 2024: ACM International Conference on Information and Knowledge Management</h2>
                    💡<a href="https://cikm2024.org/" target="_blank">https://cikm2024.org/</a>
                    <p> 截稿日期: 2024-05-13 </p>
                    <p> 通知日期: 2024-07-16 </p>
                    <p>会议日期: 2024-10-21 </p>
                    <p>会议地点: Boise, Idaho, USA  </p>
                    <p>届数:33 </p>
                    <p>CCF: <span style={{ backgroundColor: 'gold', padding: '5px', borderRadius: '5px' }}>b</span> {"  "}
                        关注: 473  {"  "}
                        参加: 84</p>

                </div>
                <div className="call">
                    📢征稿
                </div>
                <div className="overview-card">
                    <text>
                        The 22nd Theory of Cryptography Conference 2024 will be held in Milan, Italy on December 2-6, 2024. TCC 2024 is organized by the International Association for Cryptologic Research (IACR). Papers presenting original research on foundational and theoretical aspects of cryptography are sought. For more information about TCC, see the TCC manifesto.
                        Submissions will open soon
                        The Theory of Cryptography Conference deals with the paradigms, approaches, and techniques used to conceptualize natural cryptographic problems and provide algorithmic solutions to them. More specifically, the scope of the conference includes, but is not limited to the:
                        study of known paradigms, approaches, and techniques, directed towards their better understanding and utilization
                        discovery of new paradigms, approaches and techniques that overcome limitations of the existing ones
                        formulation and treatment of new cryptographic problems
                        study of notions of security and relations among them
                        modeling and analysis of cryptographic algorithms
                        study of the complexity assumptions used in cryptography
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
                <div className="comment-input">
                    <TextArea rows={4} placeholder="写下你的评论..." />
                    <Button type="primary" onClick={() => submitComment("新评论")}>
                        提交
                    </Button>
                </div>

            </div>
            <div className="right-sidebar">
                <div className="personal-card">
                    <div className="follow-btn">
                        <span>➕</span>
                        <text>我要关注</text>
                    </div>
                    <div className="participate-btn">
                        <span>✈️</span>
                        <text>我要参加</text>
                    </div>
                </div>
                <div className="follow-card">
                    <div className="star-btn">
                        <span>🌟</span>
                        <text>收藏列表</text>
                    </div>

                    <div className="follow-list">
                        以下是收藏的表格
                    </div>
                </div>

            </div>
        </div>
    );
};


export default JournalDetail