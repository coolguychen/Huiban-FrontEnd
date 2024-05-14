// 首页 展示最新的 期刊 会议

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
// import Cat from "../../Assets/image/cat.svg";

function HomePage() {
  return (
    <section>
        <Container className="home-content">
          <Row>
            <Col className="home-header">
              <h1>Weclome to Huiban!{" "} 
                <span className="wave" role="img" aria-labelledby="wave">👋🏻</span>
              </h1>
            </Col>

            <Col>
              {/* <img src={Cat} style={{ height: '500px' }} /> */}
            </Col>
          </Row>
        </Container>

        {/* 显示近期 期刊 & 会议的资讯 */}
    </section>
  );
}

export default HomePage;