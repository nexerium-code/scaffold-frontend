import { AtSign, CalendarIcon, CalendarSync, Circle, Clock, FileText, Hash, Link, Phone, Radio, Square, SquareMenu, TextQuote, Type, Video } from "lucide-react";
import { ComponentType } from "react";

export const RoleTypes = {
    ADMIN: "admin",
    STAFF: "staff"
} as const;

export type RoleType = (typeof RoleTypes)[keyof typeof RoleTypes];

export type Permissions = Record<string, Permission>;

export type Permission = {
    attendance: boolean;
    participants: boolean;
    workshops: boolean;
    feedbacks: boolean;
};

export type MetaData = {
    role: RoleType;
    permissions: Permissions | null;
};

export const EventTypes = {
    GENERAL: "General",
    CONFERENCE: "Conference",
    WORKSHOP: "Workshop",
    WEBINAR: "Webinar",
    SEMINAR: "Seminar",
    NETWORKING: "Networking",
    TRADE: "Trade",
    CONCERT: "Concert",
    MEETUP: "Meetup",
    FESTIVAL: "Festival",
    PRODUCT: "Product",
    CHARITY: "Charity",
    AWARDS: "Awards",
    SPORTS: "Sports",
    TRAINING: "Training",
    EXHIBITION: "Exhibition",
    HACKATHON: "Hackathon",
    OTHER: "Other"
} as const;

export type EventType = (typeof EventTypes)[keyof typeof EventTypes];

export const LocationTypes = {
    ONSITE: "Onsite",
    VIRTUAL: "Virtual",
    HYBRID: "Hybrid"
} as const;

export type LocationType = (typeof LocationTypes)[keyof typeof LocationTypes];

export const AttendanceTypes = {
    FREE: "Free",
    PAID: "Paid"
} as const;

export type AttendanceType = (typeof AttendanceTypes)[keyof typeof AttendanceTypes];

export const EntryPolicyTypes = {
    SINGLE: "Single",
    MULTIPLE: "Multiple"
} as const;

export type EntryPolicyType = (typeof EntryPolicyTypes)[keyof typeof EntryPolicyTypes];

export const PaymentStatusTypes = {
    PENDING: "Pending",
    PAID: "Paid",
    FAILED: "Failed"
} as const;

export type PaymentStatusType = (typeof PaymentStatusTypes)[keyof typeof PaymentStatusTypes];

export const FormInputTypes = {
    SHORT_TEXT: "ShortText",
    LONG_TEXT: "LongText",
    EMAIL: "Email",
    NUMBER: "Number",
    PHONE: "Phone",
    LINK: "Link",
    RADIO: "Radio",
    SELECT: "Select",
    CHECKBOX: "Checkbox",
    DATE: "Date",
    TIME: "Time",
    DATE_RANGE: "Date_Range"
} as const;

export type FormInputType = (typeof FormInputTypes)[keyof typeof FormInputTypes];

export const FormInputTypesIcons: Record<FormInputType, ComponentType<{ className?: string }>> = {
    [FormInputTypes.SHORT_TEXT]: Type,
    [FormInputTypes.LONG_TEXT]: TextQuote,
    [FormInputTypes.EMAIL]: AtSign,
    [FormInputTypes.NUMBER]: Hash,
    [FormInputTypes.PHONE]: Phone,
    [FormInputTypes.LINK]: Link,
    [FormInputTypes.RADIO]: Circle,
    [FormInputTypes.SELECT]: SquareMenu,
    [FormInputTypes.CHECKBOX]: Square,
    [FormInputTypes.DATE]: CalendarIcon,
    [FormInputTypes.TIME]: Clock,
    [FormInputTypes.DATE_RANGE]: CalendarSync
} as const;

export const MustHaveOptions = new Set(["Radio", "Checkbox", "Select"]);
export const CanBeUnique = new Set(["ShortText", "Email", "Phone"]);
export const SearchableTypes = new Set(["ShortText", "Email", "Link", "Phone"]);
export const FilterableTypes = new Set(["Radio", "Checkbox", "Select", "Number", "Date"]);

export const ContentTypes = {
    LIVE: "Live",
    VIDEO: "Video",
    FILE: "File"
} as const;

export type ContentType = (typeof ContentTypes)[keyof typeof ContentTypes];

export const ContentTypesIcons: Record<ContentType, ComponentType<{ className?: string }>> = {
    [ContentTypes.LIVE]: Radio,
    [ContentTypes.VIDEO]: Video,
    [ContentTypes.FILE]: FileText
} as const;

export const AgendaTypes = {
    VIRTUAL: "Virtual",
    ONSITE: "Onsite",
    HYBRID: "Hybrid"
} as const;

export type AgendaType = (typeof AgendaTypes)[keyof typeof AgendaTypes];

export const SubmissionTypes = {
    MANUAL: "Manual",
    FILE: "File",
    LINK: "Link"
} as const;

export type SubmissionType = (typeof SubmissionTypes)[keyof typeof SubmissionTypes];

export const ParticipantTypes = {
    MANAGEMENT: "management",
    SECURITY: "security",
    ORGANIZATION: "organization",
    COORDINATION: "coordination",
    REPRESENTATION: "representation",
    EXHIBITOR: "exhibitor",
    TECH: "tech",
    CLEANING: "cleaning",
    VOLUNTEER: "volunteer",
    MEDIA: "media",
    SPONSOR: "sponsor",
    VENDOR: "vendor",
    GUEST: "guest",
    VIP: "vip",
    MEDICAL: "medical",
    QUALITY: "quality",
    LOGISTICS: "logistics",
    CATERING: "catering",
    REGISTRATION: "registration",
    IT: "it",
    GOVERNMENT: "government",
    TRANSPORTATION: "transportation",
    ENTERTAINMENT: "entertainment",
    OTHER: "other"
} as const;

export type ParticipantType = (typeof ParticipantTypes)[keyof typeof ParticipantTypes];

export const StaffTypes = {
    MANAGER: "manager",
    SECURITY: "security",
    COORDINATOR: "coordinator",
    TECHNICIAN: "technician",
    CLEANER: "cleaner",
    VOLUNTEER: "volunteer",
    MEDIA: "media",
    REPRESENTATIVE: "representative",
    SPEAKER: "speaker",
    EXHIBITOR: "exhibitor",
    MEDIC: "medic",
    PERFORMER: "performer",
    DRIVER: "driver",
    IT: "it",
    HOST: "host",
    CATERING: "catering",
    REGISTRATION: "registration",
    EMERGENCY: "emergency",
    LOGISTICS: "logistics",
    OTHER: "other"
};

export type StaffType = (typeof StaffTypes)[keyof typeof StaffTypes];

export const GenderTypes = {
    MALE: "Male",
    FEMALE: "Female"
} as const;

export type GenderType = (typeof GenderTypes)[keyof typeof GenderTypes];

export const EntryTypes = {
    IN: "In",
    OUT: "Out"
} as const;

export type EntryType = (typeof EntryTypes)[keyof typeof EntryTypes];

export const EntryValidations = {
    FAILED: "Failed",
    SUCCESS: "Success",
    NEUTRAL: "Neutral"
} as const;

export type EntryValidation = (typeof EntryValidations)[keyof typeof EntryValidations];
