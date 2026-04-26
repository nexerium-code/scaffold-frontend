import { FilePlus } from "lucide-react";
import { useTranslation } from "react-i18next";

import CreateAttendanceDialog from "@/components/attendance/CreateAttendanceDialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { MetaData, RoleTypes } from "@/lib/enums";
import { useUser } from "@clerk/clerk-react";

function NoAttendanceFound() {
    const { t } = useTranslation();
    const { user } = useUser();
    const userRole = (user?.publicMetadata as MetaData)?.role;

    return (
        <div className="flex flex-1 items-center justify-center p-6">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FilePlus />
                    </EmptyMedia>
                    <EmptyTitle>{t("no-attendance-found")}</EmptyTitle>
                    <EmptyDescription>{t("no-attendance-found-description")}</EmptyDescription>
                </EmptyHeader>
                {userRole === RoleTypes.ADMIN && (
                    <EmptyContent>
                        <CreateAttendanceDialog />
                    </EmptyContent>
                )}
            </Empty>
        </div>
    );
}

export default NoAttendanceFound;
