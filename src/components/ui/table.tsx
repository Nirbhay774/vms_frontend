import React from "react";

interface TableProps {
    headers: string[];
    children: React.ReactNode;
}

export function Table({ headers, children }: TableProps) {
    return (
        <div className="w-full overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                        {headers.map((header) => (
                            <th
                                key={header}
                                className="px-4 py-3 font-medium text-zinc-500 dark:text-zinc-400"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {children}
                </tbody>
            </table>
        </div>
    );
}

export function TableRow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <tr className={`hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors ${className}`}>
            {children}
        </tr>
    );
}

export function TableCell({ children, className = "", ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td
            className={`px-4 py-3 text-zinc-900 dark:text-zinc-100 ${className}`}
            {...props}
        >
            {children}
        </td>
    );
}
