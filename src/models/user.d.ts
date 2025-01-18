/**
 * 用户信息类别
 */

export type UserType = {
    id: number;
    username: string;
    userAccount: string;
    avatarUrl?: string;
    profile: string;
    gender: Gender;
    phone: string;
    email: string;
    userStatus: UserStatus;
    userRole: UserRole;
    planetCode: string;
    tags: string[];
    createTime: Date;
};
