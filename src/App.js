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
	const userLogin = useSelector(state => state.userLogin) // 通过useSelector钩子从Redux store(store.js) 中获取了 userLogin 状态的
	const { userInfo } = userLogin

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
				<Routes >
					<Route path='/' element={<HomePage />} />
					<Route path='/conferences' element={<ConferenceInfo />} />
					<Route path='/conferenceDetail/:id' element={userInfo ? <ConferenceDetail /> : <Login />} />

					<Route path='/journals' element={<JournalInfo />} />
					<Route path='/journalDetail/:id' element={userInfo ? <JournalDetail /> : <Login />} />

					<Route path='/user' element={userInfo ? <UserInfo /> : <Login />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />

					<Route path='/managerLogin' element={<ManagerLogin />} />
					<Route path='/manage/*' element={<Manage />} />
				</Routes>
			</div>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
