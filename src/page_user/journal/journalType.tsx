// 定义期刊的类型
export type Journal = {
    journalId: string;
    fullTitle: string;
    ccfRank: string; //
    mainpageLink: string; //主页链接
    specialIssue: string; // 这个暂定？
    paperDeadline: Date; //截稿日期
    impactFactor: number; //影响因子
    publisher: string; //出版社
}

export default Journal