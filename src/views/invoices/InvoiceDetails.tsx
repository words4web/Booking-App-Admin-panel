"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Download, Mail } from "lucide-react";

export function InvoiceDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">Invoice Details</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button>
            <Mail className="h-4 w-4 mr-2" />
            Send to Customer
          </Button>
        </div>
      </div>

      <Card className="print:shadow-none">
        <CardContent className="p-8 space-y-8">
          {/* Header */}
          <div className="flex justify-between border-b pb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Company1</h2>
              <p className="text-sm text-muted-foreground">Reg: 12345678</p>
              <p className="text-sm text-muted-foreground">
                VAT: GB 123 456 789
              </p>
              <p className="text-sm text-muted-foreground">
                123 Business Park, London, UK
              </p>
            </div>
            <div className="text-right space-y-1">
              <h2 className="text-2xl font-bold text-primary">INVOICE</h2>
              <p className="text-sm text-muted-foreground"># {id}</p>
              <p className="text-sm font-medium">Date: 20-May-2024</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Bill To:</h3>
              <p className="text-sm font-medium">Logistics Corp</p>
              <p className="text-sm text-muted-foreground">123 Warehouse Rd</p>
              <p className="text-sm text-muted-foreground">Manchester, UK</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold mb-2">Payment Details:</h3>
              <p className="text-sm text-muted-foreground">Bank: Barclays</p>
              <p className="text-sm text-muted-foreground">
                Sort Code: 20-20-20
              </p>
              <p className="text-sm text-muted-foreground">Account: 12345678</p>
            </div>
          </div>

          {/* Line Items */}
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">Standard Delivery - Trip</td>
                  <td className="px-4 py-3 text-right">1</td>
                  <td className="px-4 py-3 text-right">£150.00</td>
                  <td className="px-4 py-3 text-right">£150.00</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right font-medium">
                    Subtotal
                  </td>
                  <td className="px-4 py-2 text-right">£150.00</td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-4 py-2 text-right font-medium">
                    VAT (20%)
                  </td>
                  <td className="px-4 py-2 text-right">£30.00</td>
                </tr>
                <tr className="text-lg font-bold">
                  <td colSpan={3} className="px-4 py-4 text-right">
                    Total
                  </td>
                  <td className="px-4 py-4 text-right">£180.00</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p>Please pay within 30 days.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
