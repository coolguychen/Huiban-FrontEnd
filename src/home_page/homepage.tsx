// 首页 展示最新的 期刊 会议

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Research from "../assets/images/research.png"

function HomePage() {
  return (

    <>
      <div>
      // TODO1: 受欢迎的会议列表
      // TODO2：受欢迎的期刊列表
      </div>

      <div>
      // TODO3: 截稿临近的10个会议
      // TODO4：截稿临近的10个期刊
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', height: '80vh' }}>
        <Col style={{ position: 'absolute', right: '20px' }}>
          <img src={Research} style={{ height: '200px' }} />
        </Col>
      </div>

    </>

  );
}

export default HomePage;