import React from "react"
import { User } from "./userType"

const exampleUser: User = {
    email: "example@email.com",
    imageUrl: "https://iconfont.alicdn.com/p/illus/preview_image/1SAIt26l6ecK/9dd5ffa2-becc-4088-9f34-e92e332e6186.png",
    institution: "EAST CHINA NORMAL UNIVERSITY"
}

const UserInfo: React.FC = () => {

    return (
        <div className="flex-container">
            <div className="left-sidebar">
                <div className="basic-info">
                    <h3 className="info">📂 个人信息</h3>
                    <div className="avatar-container">
                        <div className="avatar">
                            <img src={exampleUser.imageUrl} alt="User Avatar" />
                        </div>
                    </div>
                    <p>📧邮箱: {exampleUser.email}</p>
                    <p>🏢科研机构: {exampleUser.institution}</p>
                </div>

                <div className="follow-conference">
                    <h3 className="info">⭐ 收藏的会议</h3>
                </div>

                <div className="attend-conference">
                    <h3 className="info">🧑‍💻 参加的会议</h3>
                </div>

                <div className="follow-journal">
                    <h3 className="info">🧡 收藏的期刊</h3>
                </div>


            </div>

            <div className="right-sidebar">
                <div className="tools-card">
                    待开发（一些初步的想法）：
                    一些科研工具推荐？用户点击可以直接跳转？
                    根据用户的关注和收藏，推荐会议和期刊的算法？
                </div>

            </div>
        </div>
    )

}

export default UserInfo