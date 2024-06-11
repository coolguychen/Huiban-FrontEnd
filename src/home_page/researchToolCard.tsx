import React from 'react';
import { Card } from 'antd';
import { LinkOutlined } from '@ant-design/icons';


const ResearchToolCard = ({ name, url, description }) => {
    return (
        <Card className='custom-card' style={{ marginTop: 16 }}

            actions={[
                <a href={url} target="_blank" rel="noopener noreferrer">
                    Click here to visit <text style={{fontWeight: "bold"}}>{name}</text> <LinkOutlined />
                </a>
            ]}>
            <Card.Meta
                className="custom-card-meta" // 应用自定义的 className
                title={<div className="card-title">{name}</div>}
                description={<div className="card-description">{description}</div>}
            />

        </Card>
    );
};

export default ResearchToolCard;
