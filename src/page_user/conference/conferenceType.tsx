// 定义会议的类型
export type Conference = {
    conferenceId: string;
    fullTitle: string;
    ccfRank: string;
    sub: string; //所属类型
    // dblpLink: string;
    mainpageLink: string;
    place: string;
    abstractDeadline: string; //摘要DDL
    paperDeadline: string; //全文DDL
    startTime: string; //开始时间'
    endTime: string; //结束时间
    acceptedRate: number; //接受率
    isPostponed: boolean; // 是否延期
}


export type DetailConference = {
    conferenceId: string;
    fullTitle: string;
    ccfRank: string;
    dblpLink: string;
    mainpageLink: string;
    abstractDeadline: string; //摘要DDL
    paperDeadline: string; //全文DDL
    startTime: string; //开始时间'
    endTime: string; //结束时间
    followNum: number;
    sessionNum: number;
    attendNum: number;
    topicDetails: string;
}

export type EditConference = {
    conferenceId: string;
    title: string;
    fullTitle: string;
    ccfRank: string;
    sub: string; //所属类型
    year: number; //年份
    dblpLink: string;
    mainpageLink: string;
    place: string;
    abstractDeadline: string; //摘要DDL
    paperDeadline: string; //全文DDL
    startTime: string; //开始时间'
    endTime: string; //结束时间
    followNum: number;
    sessionNum: number;
    attendNum: number;
    acceptedRate: number;
    topicDetails: string;
    isPostponed: boolean;
}