/**
 * 用户信息类别
 */

export type UserType = {
    id: number;
    username: string;
    userAccount: string;
    avatarurl?: string;
    profile: string;
    gender: Gender;
    phone: string;
    email: string;
    userStatus: UserStatus;
    userRole: UserRole;
    planetcode: string;
    tags: string[];
    createTime: Date;
};
