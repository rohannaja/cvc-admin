"use client"
import { Button } from '@/components/ui/button'
import { Loader2 } from '@/components/ui/loader';
import { useQueryProcessor } from '@/hooks/useTanstackQuery';
import { ChevronLeftCircle } from 'lucide-react'
import React from 'react'
import { ReportTable } from '../components/table';
import { useRouter } from 'next/navigation';

const ResolvedReportsPage = () => {

  const router = useRouter()

  const { data, status } = useQueryProcessor({
    url: "/report",
    key: ["reports"],
    queryParams: {
      status: "resolved"
    },
    
  });

  return (
    <div className=' bg-white h-[90%] w-[95%] rounded-[50px] p-5 overflow-hidden'>
      <div className='flex space-x-2 items-center hover:bg-slate-100 w-fit py-2 px-3 rounded-md hover:cursor-pointer' onClick={() => {router.push("/reports")}}>
        <ChevronLeftCircle className='bg-none size-8'strokeWidth={1} />
        <span>Back</span>
      </div>

      <h1>Resolved Reports</h1>

      {
          (() => {
              if(status === "pending") {
                return <div className="flex justify-center items-center h-full"><Loader2 size={50} className={""}/></div>
              }

              else if (status == "success" && data?.length === 0) {
                return <div className="flex justify-center items-center h-full"><h2 className="text-slate-400 font-normal text-lg">No Resolved Reports Yet!</h2></div>
              }

              else if (status === "error") {
                return <div className="flex justify-center items-center h-full"><h2 className="text-slate-400 font-normal text-lg">Something went wrong :(</h2></div>
              }
              else {
                return <ReportTable data={data} statusToUpdate={"open"} label="Reopen Report"/>
              }
          })()
        }

        
    </div>

  )
}

export default ResolvedReportsPage
