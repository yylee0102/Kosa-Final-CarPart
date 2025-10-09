import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const MobileSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            <div className="pt-2 border-t">
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="w-12 p-3">
                <Skeleton className="h-4 w-4 rounded" />
              </th>
              <th className="text-left p-3">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="text-left p-3">
                <Skeleton className="h-4 w-12" />
              </th>
              <th className="text-left p-3">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="text-left p-3">
                <Skeleton className="h-4 w-12" />
              </th>
              <th className="text-left p-3">
                <Skeleton className="h-4 w-20" />
              </th>
              <th className="text-left p-3">
                <Skeleton className="h-4 w-16" />
              </th>
              <th className="w-24 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  <Skeleton className="h-4 w-4 rounded" />
                </td>
                <td className="p-3">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </td>
                <td className="p-3">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </td>
                <td className="p-3">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </td>
                <td className="p-3 text-center">
                  <Skeleton className="h-4 w-6 mx-auto" />
                </td>
                <td className="p-3">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="p-3">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};