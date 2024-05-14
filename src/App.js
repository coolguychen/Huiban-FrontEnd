import React, {useEffect} from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
// import { useSelector } from "react-redux";
import HomePage from './home_page/homepage.tsx'
import ConferenceInfo from './page_user/conference/conferenceInfo.tsx'
import JournalInfo from './page_user/journal/journalInfo.tsx'
import Register from './page_user/register/register.tsx';
import Login from './page_user/login/login.tsx';
// import NavBar from './components/navbar.tsx'
import Footer from './components/footer.tsx'
import "./style.css";
import "./App.css";


function App() {
  // const userLogin = useSelector(state => state.userLogin)
  // const { userInfo } = userLogin
  
  return (
		<BrowserRouter>
			{/* <NavBar /> */}
			<div className="App">
			<Routes >
				<Route path='/' element={<HomePage />} />
        <Route path='/conference' element={<ConferenceInfo />} />
        <Route path='/journal' element={<JournalInfo />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register  />} />
			</Routes>
			</div>
			<Footer />
		</BrowserRouter>
  );
}

export default App;
