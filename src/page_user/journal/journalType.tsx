// 定义期刊的类型
export type Journal = {
    journalId: string;
    ccfRank: string; //
    sub: string;
    impactFactor: number; //影响因子
    citeScore: number; //引用分数
    publisher: string; //出版社
}

export type DetailJournal = {
    journalId: string;
    ccfRank: string;
    sub: string;
    dblpLink: string;
    mainpageLink: string;
    followNum: number;
    impactFactor: number; //影响因子
    citeScore: number; //引用分数
    publisher: string; //出版社
    topicDetails: string;
}