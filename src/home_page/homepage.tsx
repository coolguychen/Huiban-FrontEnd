// 首页 展示最新的 期刊 会议

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Research from "../assets/images/research.png"

function HomePage() {
  return (

    <div className="flex-container">
      <div className="left-sidebar">
        <div className="popular">
          <div className="popular-conferences">
          <text>🔥热门会议</text>
        // TODO1: 受欢迎的会议列表

          </div>

          <div className="popular-journals">
          <text>🔥热门期刊</text>

        // TODO2：受欢迎的期刊列表
          </div>


        </div>

        <div className="latest-conferences">
          <text>⏰近期会议</text>
      // TODO3: 截稿临近的10个会议

        </div>

        <div className="latest-journals">
        <text>⏰近期期刊</text>

      // TODO4: 截稿临近的10个期刊

        </div>



      </div>


      <div className="right-sidebar">
        <div className="follow-card">
          <div className="star-btn">
            <span>🌟</span>
            <text>收藏列表</text>
          </div>

          <div className="follow-list">
            以下是收藏的列表。如果未登录，这里提示，尚未登录，请登录或注册！
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', height: '80vh' }}>
          <Col style={{ position: 'absolute', right: '20px' }}>
            <img src={Research} style={{ height: '200px' }} />
          </Col>
        </div>
      </div>


    </div>
  );
}

export default HomePage;