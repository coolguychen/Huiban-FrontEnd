import { Conference } from "../conference/conferenceType";
import Journal from "../journal/journalType";

// 维护用户个人信息
export type User = {
    userName: string; //昵称
    email: string; //邮箱
    imageUrl: string; //头像
    institution: string; //科研机构
    followConferences: Conference[];
    followJournals: Journal[];
    attendConferences: Conference[];
}