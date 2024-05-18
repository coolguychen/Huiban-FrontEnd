import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
// import { useSelector } from "react-redux";
import HomePage from './home_page/homepage.tsx'
import ConferenceInfo from './page_user/conference/conferenceInfo.tsx'
import JournalInfo from './page_user/journal/journalInfo.tsx'
import UserInfo from './page_user/user/userInfo.tsx'
import Register from './page_user/register/register.tsx';
import Login from './page_user/login/login.tsx';
import NavBar from './components/navbar.tsx'
import Footer from './components/footer.tsx'
import "./style.css";
import "./App.css";
import HomeHeader from './components/header.tsx'


function App() {
	// const userLogin = useSelector(state => state.userLogin)
	// const { userInfo } = userLogin


	return (
		<BrowserRouter>
			<>
				<div className="header-navbar-container">
					<HomeHeader />
					<NavBar />
				</div>
			</>

			<div className="App">
				<Routes >
					<Route path='/' element={<HomePage />} />
					<Route path='/conferences' element={<ConferenceInfo />} />
					<Route path='/journals' element={<JournalInfo />} />
					<Route path='/my' element={<UserInfo />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
				</Routes>
			</div>
			<Footer />
		</BrowserRouter>
	);
}

export default App;
