// Header导航栏
import { Navbar, Nav, Container, NavDropdown, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Alert } from "react-bootstrap";



// const NavBar = () => {
//     return (
//         <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
//             <Link to="/">首页</Link>
//             <Link to="/conferences">会议</Link>
//             <Link to="/journals">期刊</Link>
//             <Link to="/my">我的</Link>
//         </div>
//     );
// };

const NavBar = () => {

    // const dispatch = useDispatch();
    const navigate = useNavigate();
    // const [show, setShow] = useState<boolean>(true);

    const linkStyle = {
        textDecoration: 'none', // 去掉下划线
    };

    return (
        <Navbar variant="light" bg="transparent">
            <Container className="mynavbar" style={{ backgroundColor: '', marginLeft: '90px', marginRight: '0px' }}>
                <Nav defaultActiveKey="home" className="justify-content-center" style={{ display: 'flex', justifyContent: 'center' }}>
                    {/* TODO 2024/5/18：后续这里要加对 用户登录状态的判断 如果没登录 那么这里点击navbar 跳转到登录页面 */}
                    <Nav.Item style={{ margin: '0 10px' }}>
                        <Nav.Link as={Link} to={"/"} style={linkStyle}>首页</Nav.Link>
                    </Nav.Item>
                    <Nav.Item style={{ margin: '0 10px' }}>
                        <Nav.Link as={Link} to={"/conferences"}  style={linkStyle}>会议</Nav.Link>
                    </Nav.Item>
                    <Nav.Item style={{ margin: '0 10px' }}>
                        <Nav.Link as={Link} to={"/journals"} style={linkStyle}>期刊</Nav.Link>
                    </Nav.Item>
                    <Nav.Item style={{ margin: '0 20px 0 10px' }}>
                        <Nav.Link as={Link} to={"/user"} style={linkStyle}>我的</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;