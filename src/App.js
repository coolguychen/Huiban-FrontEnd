import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useSelector } from "react-redux";
import HomePage from './home_page/homepage.tsx'
import ConferenceInfo from './page_user/conference/conferenceInfo.tsx'
import ConferenceDetail from './page_user/conference/conferenceDetail.tsx'
import JournalInfo from './page_user/journal/journalInfo.tsx'
import JournalDetail from './page_user/journal/journalDetail.tsx'
import UserInfo from './page_user/user/userInfo.tsx'
import Register from './page_user/register/register.tsx';
import Login from './page_user/login/login.tsx';
import NavBar from './components/navbar.tsx'
import Footer from './components/footer.tsx'
import "./style.css";
import "./App.css";
import HomeHeader from './components/header.tsx'
import Manage from './page_user/manage/manage.tsx'
import ManagerLogin from './page_user/login/managerlogin.tsx';

function App() {
	const userLogin = useSelector(state => state.userLogin)
	const { userInfo } = userLogin
	// const role = userInfo.data.username // 用户角色'

	const getRole = () => {
		let role = userInfo ? userInfo.data.username : null
		return role
	}

	return (
		<BrowserRouter>
			<>
				<div className="header-navbar-container">
					<div>
						<HomeHeader />
					</div>
					<div className='nav'>
						<NavBar />
					</div>
				</div>
			</>

			<div className="App">
				{getRole() === 'admin' ?
					<Routes>
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
						<Route path='/' element={<Manage />} />
						<Route path='/managerLogin' element={<ManagerLogin />} />
						<Route path='/manage/*' element={<Manage />} />
						<Route path='/conferenceDetail/:id' element={userInfo ? <ConferenceDetail /> : <Login />} />
						<Route path='/journalDetail/:id' element={userInfo ? <JournalDetail /> : <Login />} />
					</Routes>
					:
					<Routes>
						<Route path='/' element={<HomePage />} />
						<Route path='/login' element={<Login />} />
						<Route path='/managerLogin' element={<ManagerLogin />} />
						<Route path='/register' element={<Register />} />
						<Route path='/conferences' element={userInfo ? <ConferenceInfo /> : <Login />} />
						<Route path='/conferenceDetail/:id' element={userInfo ? <ConferenceDetail /> : <Login />} />
						<Route path='/journals' element={userInfo ? <JournalInfo /> : <Login />} />
						<Route path='/journalDetail/:id' element={userInfo ? <JournalDetail /> : <Login />} />
						<Route path='/user' element={userInfo ? <UserInfo /> : <Login />} />
					</Routes>}
			</div>
			{/* <Footer /> */}
		</BrowserRouter>
	);
}

export default App;
