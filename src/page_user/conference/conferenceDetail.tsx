// 展示会议详情
import React from "react";

const ConferenceDetail: React.FC = () => {
    return (
        <div className="flex-container">
            <div className="left-sidebar">

                <div className="detail-card">
                    <h2>CIKM 2024: ACM International Conference on Information and Knowledge Management</h2>
                    💡<a href="https://cikm2024.org/" target="_blank">https://cikm2024.org/</a>
                    <p> 截稿日期:2024-05-13 </p>
                    <p> 通知日期:2024-07-16 </p>

                    <p>会议日期:2024-10-21 </p>
                    <p>会议地点:Boise, Idaho, USA  </p>
                    <p>届数:33 </p>
                    <p>CCF: b</p>
                    <p>关注: 473</p>
                    <p>参加: 84</p>
                </div>
                <div>


                </div>
                📢征稿
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
                💭评论
                <div className="comment-area">


                </div>



            </div>
            <div className="right-sidebar">
                <div className="personal-card">
                    <div className="follow">
                        我要关注

                    </div>
                    <div className="participate">
                        我要参加

                    </div>
                </div>

                <div className="follow-card">
                    个人收藏列表
                        
                </div>



            </div>
        </div>
    );
};


export default ConferenceDetail