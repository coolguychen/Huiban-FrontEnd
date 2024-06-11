// 首页 展示最新的 期刊 会议

import React from "react";
import { Col } from "react-bootstrap";
import Research from "../assets/images/research.png"
import PopularConferences from "./getPopularConferences.tsx";
import PopularJournals from "./getPopularJournals.tsx";
import RecentConferences from "./getRecentConferences.tsx";
import { useSelector } from "react-redux";
import ResearchToolCard from "./researchToolCard.tsx";
import { tools } from "./scienceTools.tsx";

function HomePage() {
  const userLogin = useSelector((state: any) => state.userLogin)
  console.log(userLogin)
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
        {/* <div className="follow-card">
          <div className="star-btn">
            <text>🧑‍🎓💡  科研直链</text>
          </div>

          <div className="follow-list">
            {tools.map(tool => (
              <ResearchToolCard key={tool.name} name={tool.name} url={tool.url} description={tool.description} />
            ))}
          </div>
        </div> */}
        <div className="tools-card">
          <text style={{ fontWeight: "bold" }}>🧑‍🎓💡  科研直链</text>
          {tools.map(tool => (
            <ResearchToolCard key={tool.name} name={tool.name} url={tool.url} description={tool.description} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage;