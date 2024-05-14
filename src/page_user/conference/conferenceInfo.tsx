//TODO： 展示全部CCF会议
import { Button, Space, DatePicker, version } from 'antd';
import React from 'react';
import Conference from './conferenceType.tsx'


const conferences: Conference[] = [
    { name: "CCF Conference 1", date: "2024-05-16", location: "Virtual" },
    { name: "CCF Conference 2", date: "2024-06-20", location: "Beijing" },
    { name: "CCF Conference 3", date: "2024-08-10", location: "Shanghai" },
    // Add more conference data as needed
];

const ConferenceInfo: React.FC = () => {
    return (
        <div>
            <h3>CCF Conferences</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {conferences.map((conference, index) => (
                        <tr key={index}>
                            <td>{conference.name}</td>
                            <td>{conference.date}</td>
                            <td>{conference.location}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ConferenceInfo;