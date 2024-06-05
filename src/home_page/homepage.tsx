// 首页 展示最新的 期刊 会议

import React from "react";
import { Container, Row, Col, Tab } from "react-bootstrap";
import Research from "../assets/images/research.png"
import { Conference } from "../page_user/conference/conferenceType";
import Journal from "../page_user/journal/journalType";
import { Link } from "react-router-dom";
import { Table } from "antd";
import PopularConferences from "./getPopularConferences.tsx";
import PopularJournals from "./getPopularJournals.tsx";
import RecentConferences from "./getRecentConferences.tsx";
import { useSelector } from "react-redux";
import Login from "../page_user/login/login.tsx";

function HomePage() {
  const userLogin = useSelector((state: any) => state.userLogin)
  console.log(userLogin)

  // 定义近期会议列
  const latestConfCol = [
    {
      title: '会议',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link to={`/conferenceDetail/${record.conferenceId}`} >
          {text + record.year}
        </Link>
      ),
    },
    {
      title: '全称',
      dataIndex: 'fullTitle',
      key: 'fullTitle',
      render: (text, record) => <a href={record.mainpageLink}>{text}</a> //点击全称 跳转到主页
    },
    {
      title: 'CCF',
      dataIndex: 'ccfRank',
      key: 'ccfRank',
      // 据不同的条件渲染为不同颜色，同时使该标签带有圆角
      render: (ccfRank) => {
        if (!ccfRank) return null; // 如果 ccfRank 为空，则为N

        let backgroundColor;
        switch (ccfRank) {
          case 'A':
            backgroundColor = 'pink';
            break;
          case 'B':
            backgroundColor = 'gold';
            break;
          case 'C':
            backgroundColor = 'honeydew';
            break;
          default:
            backgroundColor = 'grey';
            ccfRank = 'N'
        }
        return (
          <span style={{ backgroundColor, padding: '5px', borderRadius: '5px' }}>{ccfRank}</span>
        );
      },

    },
    {
      title: '延期',
      dataIndex: 'isPostponed',
      key: 'isPostponed',
      render: (isPostponed) => {
        if (isPostponed) { // 如果延期
          return <span style={{ backgroundColor: 'red', padding: '5px', borderRadius: '5px' }}>延期</span>
        }
      }
    },
    {
      title: '摘要截止',
      dataIndex: 'abstractDeadline',
      key: 'abstractDeadline',
      render: date => <span>{date.toDateString()}</span>,
    },
    {
      title: '全文截止',
      dataIndex: 'paperDeadline',
      key: 'paperDeadline',
      render: date => <span>{date.toDateString()}</span>,
    },
    {
      title: '开会时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: date => <span>{date.toDateString()}</span>,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
      render: date => <span>{date.toDateString()}</span>,
    },
    {
      title: '地点',
      dataIndex: 'place',
      key: 'place',
      render: place => <span>📍{place}</span>,
    },
  ];

  // 定义列
  const latestJourCol = [
    {
      title: '期刊',
      dataIndex: 'journalId',
      key: 'journalId',
      render: (text, record) => <Link to={`/journalDetail/${record.journalId}`}>{text}</Link>,//点击全称 跳转到期刊详情页
    },
    {
      title: 'CCF',
      dataIndex: 'ccfRank',
      key: 'ccfRank',
      // 据不同的条件渲染为不同颜色，同时使该标签带有圆角
      render: (ccfRank) => {
        if (!ccfRank) return null; // 如果 ccfRank 为空，则不渲染
        let backgroundColor;
        switch (ccfRank) {
          case 'A':
            backgroundColor = 'pink';
            break;
          case 'B':
            backgroundColor = 'gold';
            break;
          case 'C':
            backgroundColor = 'honeydew';
            break;
          default:
            backgroundColor = '';
            ccfRank = 'N'
        }

        return (
          <span style={{ backgroundColor, padding: '5px', borderRadius: '5px' }}>{ccfRank}</span>
        );
      },
    },
    {
      title: '影响因子',
      dataIndex: 'impactFactor',
      key: 'impactFactor',
      render: impactFactor => <span>🎯{impactFactor}</span>,
    },
    {
      title: '出版社',
      dataIndex: 'publisher',
      key: 'publisher',
      render: publisher => <span>📚{publisher}</span>,
    },
  ];

  return (
    <div className="flex-container">
      <div className="left-sidebar">
        <div className="popular">
          <div className="popular-conferences">
            <text>🔥热门会议</text>
            <PopularConferences />
          </div>

          <div className="popular-journals">
            <text>🔥热门期刊</text>
            <PopularJournals />
          </div>
        </div>

        <div className="latest-conferences">
          <text>⏰近期会议</text>
          <RecentConferences />
        </div>
      </div>

      <div className="right-sidebar">
        <div className="follow-card">
          <div className="star-btn">
            <span>🌟</span>
            <text>收藏列表</text>
          </div>

          <div className="follow-list">
            {userLogin ? (<div>
              以下是收藏的列表。如果未登录，这里提示，尚未登录，请登录或注册！

            </div>) : (<div>
              请登录！
            </div>)}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', height: '80vh' }}>
          <Col style={{ position: 'absolute', right: '20px' }}>
            <img src={Research} style={{ height: '200px' }} />
          </Col>
        </div>
      </div>
    </div>
  )
}

export default HomePage;