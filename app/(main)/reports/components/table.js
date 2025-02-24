import React from "react";

import { Button } from "@/components/ui/button";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import Report from "./report";

export function ReportTable({ data, statusToUpdate, label}) {
  
  return (
    <div className="flex flex-col mt-2 space-y-5 h-full py-5">
      <section className="flex justify-between">
        <div className="flex space-x-10 ">
          <div className="w-[250px] font-semibold uppercase text-md font-sans px-5">Title</div>
          <div className="w-[250px] font-semibold uppercase text-md font-sans px-5">Description</div>
        </div>
        {/* <div>Action</div> */}
      </section>
      <div className="flex flex-col space-y-2  h-full overflow-auto">
        {data?.map((d) => (
          <Report data={d} statusToUpdate={statusToUpdate} label={label} />
        ))}
      </div>
    </div>
  );
}
