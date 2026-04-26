import { Spinner } from '@/components/ui/spinner';

function SpinnerPage() {
    return (
        <div className="absolute inset-0 grid h-dvh w-svw place-items-center">
            <Spinner className="size-14" />
        </div>
    );
}

export default SpinnerPage;
