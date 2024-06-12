// Header导航栏
import { Navbar, Nav, Container, NavDropdown, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducer/action";

const NavBar = () => {
    const userLogin = useSelector((state: any) => state.userLogin)
    const { userInfo } = userLogin

	const getRole = () => {
		let role = userInfo ? userInfo.data.username : null
		return role
	}

    const dispatch = useDispatch()

    const linkStyle = {
        textDecoration: 'none',
        backgroundImage: 'linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)',
        borderRadius: '8px',
        padding: '2px',
        fontWeight: 'bold',
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)' // 选中的高亮样式和阴影效果
    };

    const [activeLink, setActiveLink] = useState("/");

    const handleLinkClick = (path) => {
        setActiveLink(path);
    };

    const handleLogout = () => {
        dispatch(logout()); //退出登录
    }

    return (
        getRole() === 'admin' ?
            <>
                <Navbar variant="light" expand="sm" bg="transparent">
                    <Container className="mynavbar" style={{ backgroundColor: '', marginLeft: '90px', marginRight: '0px' }}>
                        <Navbar.Collapse>
                            <Nav defaultActiveKey="home" className="justify-content-center" style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                                <Nav.Item style={{ margin: '0 10px', fontWeight: "bold", fontSize: "24px" }}>
                                    管理系统
                                </Nav.Item>
                                <Nav.Item style={{ margin: '0 20px 0 10px' }}>
                                    <Nav.Link as={Link} to={"/login"} style={{textDecoration: 'none',}}
                                        onClick={() => { handleLogout() }}
                                    >登出</Nav.Link>
                                </Nav.Item>
                            </Nav>

                        </Navbar.Collapse>


                    </Container>
                </Navbar>
            </> :
            <>
                <Navbar variant="light" expand="sm" bg="transparent">
                    <Container className="mynavbar" style={{ backgroundColor: '', marginLeft: '90px', marginRight: '0px' }}>
                        <Navbar.Collapse>
                            <Nav defaultActiveKey="home" className="justify-content-center" style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
                                {/* TODO 2024/5/18：后续这里要加对 用户登录状态的判断 如果没登录 那么这里点击navbar 跳转到登录页面 */}
                                <Nav.Item style={{ margin: '0 10px' }}>
                                    <Nav.Link as={Link} to={"/"} style={activeLink === "/" ? { ...linkStyle } : { textDecoration: 'none' }}
                                        onClick={() => handleLinkClick("/")}>首页</Nav.Link>
                                </Nav.Item>
                                <Nav.Item style={{ margin: '0 10px' }}>
                                    <Nav.Link as={Link} to={"/conferences"} style={activeLink === "/conferences" ? { ...linkStyle } : { textDecoration: 'none' }}
                                        onClick={() => handleLinkClick("/conferences")}>会议</Nav.Link>
                                </Nav.Item>
                                <Nav.Item style={{ margin: '0 10px' }}>
                                    <Nav.Link as={Link} to={"/journals"} style={activeLink === "/journals" ? { ...linkStyle } : { textDecoration: 'none' }}
                                        onClick={() => handleLinkClick("/journals")}>期刊</Nav.Link>
                                </Nav.Item>
                                {userInfo ? (
                                    <Nav.Item style={{ margin: '0 20px 0 10px' }}>
                                        <Nav.Link as={Link} to={"/user"} style={activeLink === "/user" ? { ...linkStyle } : { textDecoration: 'none' }}
                                            onClick={() => handleLinkClick("/user")}
                                        >我的</Nav.Link>
                                    </Nav.Item>
                                ) : (
                                    // 如果userInfo为空 就跳转到登录页面
                                    <Nav.Item style={{ margin: '0 20px 0 10px' }}>
                                        <Nav.Link as={Link} to={"/login"} style={activeLink === "/user" ? { ...linkStyle } : { textDecoration: 'none' }}
                                            onClick={() => handleLinkClick("/user")}
                                        >我的</Nav.Link>
                                    </Nav.Item>
                                )}
                            </Nav>
                        </Navbar.Collapse>

                    </Container>
                </Navbar>
            </>


    );
}

export default NavBar;