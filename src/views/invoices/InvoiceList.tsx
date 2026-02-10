"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// Mock Invoices
const mockInvoices = [
  {
    id: "INV-2024-001",
    customer: "Logistics Corp",
    date: "2024-05-20",
    amount: 180.0,
    status: "paid",
  },
  {
    id: "INV-2024-002",
    customer: "Retail Giant",
    date: "2024-05-21",
    amount: 360.0,
    status: "pending",
  },
];

export function InvoiceList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Invoice #
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Customer
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {mockInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">{inv.id}</td>
                    <td className="p-4 align-middle">{inv.customer}</td>
                    <td className="p-4 align-middle">{inv.date}</td>
                    <td className="p-4 align-middle capitalize">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          inv.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      £{inv.amount.toFixed(2)}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/invoices/${inv.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
