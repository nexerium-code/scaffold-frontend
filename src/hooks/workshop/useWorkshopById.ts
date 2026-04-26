import { getWorkshopById as getWorkshopByIdAPI } from '@/services/workshop/Workshop.api';
import { useQuery } from '@tanstack/react-query';

export function useWorkshopById(eventId: string, workshopId: string) {
    const {
        data: workshop,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["workshop", eventId, workshopId],
        queryFn: () => getWorkshopByIdAPI(eventId, workshopId),
        retry: false
    });

    return { workshop, loading, isError };
}
