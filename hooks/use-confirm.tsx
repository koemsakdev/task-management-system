import React, { JSX, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ResponsiveModal } from '@/components/responsive-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const UseConfirmHook = (
    title: string,
    message: string,
    variant: "primary" | "secondary" | "destructive" | "outline" | "ghost" | "link" = "secondary"
): [() => Promise<unknown>, () => JSX.Element] => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

    const confirm = () => {
        return new Promise<boolean>((resolve) => {
            setPromise({ resolve });
        });
    };

    const handleClose = () => {
        setPromise(null);
    }

    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    }

    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    }

    const confirmationDialog = () => (
        <ResponsiveModal open={!!promise} onOpenChange={handleClose}>
            <Card className='w-full h-full border-none'>
                <CardContent className='pt-8'>
                    <CardHeader className='p-0'>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{message}</CardDescription>
                    </CardHeader>
                    <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
                        <Button onClick={handleCancel} variant={"secondary"} className='w-full lg:w-auto'>
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} variant={variant as "secondary" | "destructive" | "outline" | "ghost" | "link" | "default"} className='w-full lg:w-auto'>
                            Confirm
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </ResponsiveModal>
    )
    return [confirm, confirmationDialog];
}

export default UseConfirmHook