import { Button } from '@/components/ui/button'
import { useMutateProcessor } from '@/hooks/useTanstackQuery'
import React from 'react'

export const Report = ({data, statusToUpdate, label}) => {

    const resolveReport = useMutateProcessor({
        url:`/report/${data?._id}`,
        method: "PUT",
        key:['reports']
      })
    
      const handleCompleteReport = () => {
        resolveReport.mutate({
          status: statusToUpdate,
        }, {
          onSuccess: (data) => {
    
          },
          onError: (error) => {
    
          }
        })
      }

  return (
    <section className="flex justify-between px-5 py-1 rounded-[50px] bg-[#DFE8FA]">
            <div className="flex space-x-10 items-center">
              <div className="w-[250px] text-sm ">{data.rpt_title}</div>
              <div className="w-[250px] text-sm line-clamp-2 capitalize ">{data.rpt_desc}</div>
            </div>
            <Button className="bg-[#2b2D42] px-8 py-2 rounded-[25px] " onClick={handleCompleteReport}>
              {label}
            </Button>
          </section>
  )
}

export default Report
