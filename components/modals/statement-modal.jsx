import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModal } from "@/hooks/useModalStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import {
  // apiClient,
  useMutateProcessor,
  // useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { useToast } from "@/hooks/use-toast"
import { Badge } from "../ui/badge";
import { formatToDecimal, formatToReadableDate } from "@/lib/numberFormatter";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { File, SquareArrowOutUpLeft, SquareArrowOutUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
// import { CreateClientSchema } from "schema/client";
// import axios from "axios";
// import { useRouter } from "next/router";

const StatementModal = () => {
  const { isOpen, type, onClose, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "statement-modal";
  const onHandleClose = () => {
    onClose();
  };
  const form = useForm({
    // resolver: zodResolver(CreateClientSchema),
    defaultValues: {
        status: ''
    },
    mode: "all",
  });



  const isLoading = form.formState.isSubmitting
  const { toast } = useToast()
  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [isModalOpen]);

  const router = useRouter()
  const queryClient = useQueryClient()
  const onSubmit = async (values) => {
    
  };

  const monthMapping = {
    "01": "January",
    "02": "february",
    "03": "march",
    "04": "april",
    "05": "may",
    "06": "june",
    "07": "july",
    "08": "august",
    "09": "september",
    "10": "october",
    "11": "november",
    "12": "december",
  };

  const year = data?.statement?.bll_bill_cov_period?.split("-")[0] || ""
  const month = data?.statement?.bll_bill_cov_period?.split("-")[1] || ""
  
  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="max-h-[95vh] max-w-[90vw] md:w-[550px] border-none overflow-y-auto bg-cello bg-white text-slate-800 ">
          <DialogHeader className="pt-3 ">
            <DialogTitle className="text-xl text-left font-bold ">
              Billing Statement <span className="text-md ">{data?.statement?.bll_id}</span> 
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="w-full mt-5 grid  grid-rows-1 space-y-3">
                  <div className="flex justify-between">
                      <div className="flex flex-col text-sm ">
                        <span>Bill Coverage Date</span>
                        <span className="font-semibold">{monthMapping[month]} {year}</span>
                      </div>

                      <div className="flex flex-col text-sm items-center">
                        <span>Water Bill Proof </span>
                        <a href={data?.statement?.bll_water_cons_img} target="_blank" className={cn(`underline hover:bg-slate-200 hover:cursor-pointer p-2 rounded-md `,!data?.statement?.bll_water_cons_img && "opacity-[0.5] pointer-events-none")}><SquareArrowOutUpRight /></a>
                      </div>

                      <div className="flex flex-col text-sm ">
                        <span>Status </span>
                        <span className="font-semibold"><Badge variant={(data?.statement?.transactions_status === "completed" && data?.statement?.bll_pay_stat === "paid") ? "completed" : "pending"} className="text-white">{data?.statement?.bll_pay_stat}</Badge></span>
                      </div>
                  </div>

                  <div className="flex flex-col space-y-5">
                  <section>
                    <h5>Initial Amount</h5>
                  <div className="flex flex-col space-y-1">
                      <div className="flex  text-sm justify-between">
                        <span>Hoa Maintenenace</span>
                        <span className="font-semibold">{formatToDecimal(data?.statement?.bll_hoamaint_fee || 0)}</span>
                      </div>
                      <div className="flex  text-sm justify-between">
                        <span>Water</span>
                        <span className="font-semibold">{formatToDecimal(data?.statement?.bll_water_charges || 0)}</span>
                      </div>

                      <div className="flex  text-sm justify-between">
                        <span>Garbage</span>
                        <span className="font-semibold">{formatToDecimal(data?.statement?.bll_garb_charges || 0)}</span>
                      </div>
                      <div className="flex  text-sm justify-between mt-2">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">{formatToDecimal(data?.statement?.bll_total_amt_due || 0)}</span>
                      </div>
                  </div>
                  </section>
                  <section>
                    <h5>Paid Amount</h5>
                  <div className="flex flex-col space-y-1">
                      <div className="flex  text-sm justify-between">
                        <span>Hoa Maintenenace</span>
                        <span className="font-semibold">{formatToDecimal(data?.statement?.bll_paid_breakdown?.hoa || 0)}</span>
                      </div>
                      <div className="flex  text-sm justify-between">
                        <span>Water</span>
                        <span className="font-semibold">{formatToDecimal(data?.statement?.bll_paid_breakdown?.water || 0)}</span>
                      </div>

                      <div className="flex  text-sm justify-between">
                        <span>Garbage</span>
                        <span className="font-semibold">{formatToDecimal(data?.statement?.bll_paid_breakdown?.garbage || 0)}</span>
                      </div>

                      <div className="flex  text-sm justify-between mt-2">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">{formatToDecimal(data?.statement?.bll_total_paid || 0)}</span>
                      </div>
                      
                  </div>
                  </section>
                  </div>

              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatementModal;