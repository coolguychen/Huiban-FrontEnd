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