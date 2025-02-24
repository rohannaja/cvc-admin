"use client";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

const DATE_FORMAT = `MMM d yyyy`;

export const columns = [
  {
    accessorKey: "_id",
    header: () => {
      return <div className="sr-only dark:text-white">Id</div>;
    },
    cell: ({ row }) => {
      const id = row.getValue("id");
      return <div className="sr-only dark:text-white">{id}</div>;
    },
  },
  {
    accessorKey: "rpt_title",
    accessorFn: (row) => {
      const title = row?.rpt_title;
      return title;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  sr-only flex items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      // const yearEnrolled = row.getValue('') as Date
      const title = row.original?.rpt_title;
      return (
        <div className="">{title}</div>
      );
    },
  },
  {
    accessorKey: "rpt_desc",
    accessorFn: (row) => {
      const description = row?.profile?.rpt_desc || {};
      return description;
    },
    header: ({ column }) => (
      <div
        className="text-[#181a19]  flex sr-only items-center cursor-pointer dark:text-white flex-1"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lastname <ArrowUpDown className="ml-2 h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      
      const description = row.original?.rpt_desc;
      return <div className={` flex items-center`}>{description}</div>;
    },
  },
  
  // {
  //   accessorKey: "createdAt",
  //   accessorFn: (row) => {
  //     const createdAt = row.createdAt;
  //     return createdAt;
  //   },
  //   header: ({ column }) => {
  //     return (
  //       <div
  //         className=" text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         CreatedAt
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </div>
  //     );
  //   },
  //   cell: ({ row }) => {
  //     const createdAt = row.original?.createdAt;
  //     return (
  //       <div className="">{format(new Date(createdAt || new Date()), DATE_FORMAT)}</div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: "action",
  //   header: ({ column }) => {
  //     return (
  //       <div
  //         className=" text-[#181a19]  flex items-center cursor-pointer dark:text-white flex-1"
  //         onClick={() => column.toggleSorting(ctolumn.getIsSorted() === "asc")}
  //       >
  //       </div>
  //     );tttttttttttttttttttttttt
  //   },
  //   cell: ({ row }) => {
  //     const createdAt = row.original?.createdAt;
  //     return (
  //       // @ts-nocheck
  //       // @ts-ignore
  //       <ActionButton data={row.original} />
  //     );
  //   },
  // },
];