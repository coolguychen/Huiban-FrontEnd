// 定义会议的类型
export type Conference = {
    conferenceId: string;
    title: string; 
    fullTitle: string;
    ccfRank: string;
    sub: string; //所属类型
    year: number; //年份
    dblpLink: string;
    mainpageLink: string;
    place: string;
    abstractDeadline: Date; //摘要DDL
    paperDeadline: Date; //全文DDL
    startTime: Date; //开始时间
    acceptedRate: number; //接受率
    isPostponed: boolean; // 是否延期
}