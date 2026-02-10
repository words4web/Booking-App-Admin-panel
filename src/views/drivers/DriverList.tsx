'use client'
import { Eye, CheckCircle, XCircle } from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDrivers } from "@/src/lib/dummy-data";

// Extended mock data
const extendedDrivers = [
  {
    ...mockDrivers[0],
    email: "john@example.com",
    phone: "+44 7700 900001",
    approved: true,
  },
  {
    ...mockDrivers[1],
    email: "jane@example.com",
    phone: "+44 7700 900002",
    approved: true,
  },
  {
    id: "3",
    name: "Mike Johnson",
    status: "offline" as const,
    email: "mike@example.com",
    phone: "+44 7700 900003",
    approved: false,
  },
];

export function DriverList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Phone
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                    Approved
                  </th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {extendedDrivers.map((driver) => (
                  <tr
                    key={driver.id}
                    className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">
                      {driver.name}
                    </td>
                    <td className="p-4 align-middle">{driver.email}</td>
                    <td className="p-4 align-middle">{driver.phone}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          driver.status === "available"
                            ? "bg-green-100 text-green-800"
                            : driver.status === "busy"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                        }`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-center">
                      {driver.approved ? (
                        <CheckCircle className="h-5 w-5 text-green-600 inline" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 inline" />
                      )}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/drivers/${driver.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Link>
                        </Button>
                        {!driver.approved && (
                          <Button variant="default" size="sm">
                            Approve
                          </Button>
                        )}
                      </div>
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
