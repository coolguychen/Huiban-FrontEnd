// 首页 展示最新的 期刊 会议

import React from "react";
import { Container, Row, Col, Tab } from "react-bootstrap";
import Research from "../assets/images/research.png"
import Tweelet from "../assets/images/Tweelet1.png"
import { Conference } from "../page_user/conference/conferenceType";
import Journal from "../page_user/journal/journalType";
import { Link } from "react-router-dom";
import { Table } from "antd";


const popularConferences: Conference[] = [
  {
    conferenceId: "CIKM2024",
    title: "CIKM",
    fullTitle: "ACM International Conference on Information and Knowledge Management 2024",
    ccfRank: "B",
    sub: "数据库/数据挖掘/内容检索",
    year: 2024,
    dblpLink: "", // 填入对应链接
    mainpageLink: "https://cikm2024.org/",
    place: "Boise, Idaho, USA",
    abstractDeadline: new Date("2024-05-13"),
    paperDeadline: new Date("2024-07-16"),
    startTime: new Date("2024-10-21"),
    endTime: new Date("2024-11-21"),
    acceptedRate: 0.22, // 添加接受率
    isPostponed: false
  },
];


const popularJournals: Journal[] = [
  {
    journalId: "IS",
    fullTitle: "Information Systems",
    ccfRank: "A",
    mainpageLink: "http://www.journals.elsevier.com/information-systems/",
    specialIssue: "Special Issue on Data Analytics",
    paperDeadline: new Date("2024-06-30"),
    impactFactor: 4.5,
    publisher: "Elsevier"
  },
];

function HomePage() {


  // 在只有一页的情况下隐藏分页器
  const paginationProps = {
    hideOnSinglePage: true
  }


  // 定义热门会议列
  const popularConfCol = [
    {
      title: '会议',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Link to={`/conferenceDetail/${record.conferenceId}`}>
          {text + record.year}
        </Link>
      ),
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
      title: '地点',
      dataIndex: 'place',
      key: 'place',
      render: place => <span>📍{place}</span>,
    },
  ];

  // 定义热门期刊列
  const popularJourCol = [
    {
      title: '期刊',
      dataIndex: 'fullTitle',
      key: 'fullTitle',
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
  ];

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
      dataIndex: 'fullTitle',
      key: 'fullTitle',
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
      title: '截稿时间',
      dataIndex: 'paperDeadline',
      key: 'paperDeadline',
      render: date => <span>{date.toDateString()}</span>,
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
            <Table columns={popularConfCol} dataSource={popularConferences}
              style={{ margin: 16 }} pagination={paginationProps} />
          </div>

          <div className="popular-journals">
            <text>🔥热门期刊</text>
            <Table columns={popularJourCol} dataSource={popularJournals}
              style={{ margin: 16 }} pagination={paginationProps} />

          </div>


        </div>

        <div className="latest-conferences">
          <text>⏰近期会议</text>
          {/* 截稿临近的10个会 */}
          <Table columns={latestConfCol} dataSource={popularConferences}
            style={{ margin: 16 }} pagination={paginationProps} />
        </div>
        <div className="latest-journals">
          <text>⏰近期期刊</text>
          {/* 截稿临近的10个期刊 */}
          <Table columns={latestJourCol} dataSource={popularJournals}
            style={{ margin: 16 }} pagination={paginationProps} />
        </div>
      </div>

      <div className="right-sidebar">
        <div className="follow-card">
          <div className="star-btn">
            <span>🌟</span>
            <text>收藏列表</text>
          </div>

          <div className="follow-list">
            以下是收藏的列表。如果未登录，这里提示，尚未登录，请登录或注册！
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', height: '80vh' }}>
          <Col style={{ position: 'absolute', right: '20px' }}>
            <img src={Research} style={{ height: '200px' }} />
          </Col>
        </div>
      </div>
    </div>
  );
}

export default HomePage;