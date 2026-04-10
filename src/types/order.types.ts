

export interface OrderStatusCardProps {
    value: string;
    name: string;
    icon: React.ReactNode;
    color: string;
}
export interface OrderProps {
    id: string;
    orderNumber: string;
    client: string;
    time: string;
    status: string;
    total: number;
}