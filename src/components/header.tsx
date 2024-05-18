import React from "react";
import { Col, Container, Row } from "react-bootstrap";


function HomeHeader() {
    return (
        <Container className="home-content">
            <Row>
                <Col className="home-header">
                    <h2><span className="wave" role="img" aria-labelledby="wave">👋</span>
                        {" "}Weclome to Conference Partner🧑‍🎓🔍
                    </h2>
                </Col>
            </Row>
        </Container>
    );
}

export default HomeHeader;