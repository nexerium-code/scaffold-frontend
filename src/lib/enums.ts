export const RoleTypes = {
    ADMIN: "admin",
    MEMBER: "member"
} as const;

export type RoleType = (typeof RoleTypes)[keyof typeof RoleTypes];

export type Permission = {
    resources: boolean;
};

export type Permissions = Record<string, Permission>;

export type MetaData = {
    role?: RoleType;
    permissions?: Permissions | null;
};

export const ResourceStatusTypes = {
    ACTIVE: "active",
    ARCHIVED: "archived",
    DRAFT: "draft"
} as const;

export type ResourceStatusType = (typeof ResourceStatusTypes)[keyof typeof ResourceStatusTypes];
