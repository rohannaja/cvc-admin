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
// import { CreateClientSchema } from "schema/client";
// import axios from "axios";
// import { useRouter } from "next/router";

const TransactionModal = () => {
  const { isOpen, type, onClose, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "transaction-modal";
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

  const transaction = useMutateProcessor({
    url: `/transaction/update-status/${data?.trn_id}`,
    key: ["transactions", data?.trn_id],
    method: "PUT",
  });

  const isLoading = form.formState.isSubmitting || transaction.status === "pending";
  const { toast } = useToast()
  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [isModalOpen]);

  const router = useRouter()
  const queryClient = useQueryClient()
  const onSubmit = async (values) => {
    transaction.mutate(values, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ['transactions'],
          refetchType:"all"
        })
        toast({title: "Transaction Status", description: `Transaction has been updated`,});
        onClose()
        router.refresh()
        setTimeout(() => {
          window.location.reload()
        }, 1000)

      },
      onError: (error) => {
        console.error(error);
        // toast.error("Username did not create");
      },
      onSettled: (data, error) => {
      },
    });
  };

  console.log(data)
  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="max-h-[95vh] max-w-[90vw] md:w-[550px] border-none overflow-y-auto bg-cello bg-white text-slate-800 ">
          <DialogHeader className="pt-3 ">
            <DialogTitle className="text-xl text-left font-bold ">
              Transaction <span className="text-md ">{data?.trn_id}</span> 
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="w-full mt-5 grid  grid-rows-3 space-y-3">
                  <div className="grid grid-rows-1 grid-cols-3">
                      <div className="flex flex-col text-sm ">
                        <span>Transaction Date</span>
                        <span className="font-semibold">{formatToReadableDate( data?.trn_created_at ||new Date)}</span>
                      </div>
                      <div className="flex flex-col text-sm ">
                        <span>Transaction</span>
                        <span className="font-semibold">{data?.trn_type}</span>
                      </div>
                      <div className="flex flex-col text-sm ">
                        <span>Status </span>
                        <span className="font-semibold"><Badge variant={data?.trn_status} className="text-white">{data?.trn_status}</Badge></span>
                      </div>
                  </div>
                  <div className="grid grid-rows-1 grid-cols-3">
                      <div className="flex flex-col text-sm">
                        <span>Transaction For</span>
                        <span className="font-semibold">{data?.trn_user_init}</span>
                      </div>
                      <div className="flex flex-col text-sm">
                        {
                          data?.trn_status === "rejected" && <>
                            <span>Reason</span>
                            <span className="font-semibold">{data?.trn_reason}</span>
                          </>
                        }
                    
                      </div>
                      <div className="flex flex-col text-sm">
                        <a href={data?.trn_image_url} target="_blank">
                          <Button className="underline"  type="button" variant={"link"} size="sm" >View Payment Proof</Button>
                        </a>
                      </div>
                  </div>

                  <div className="grid grid-rows-1 grid-cols-3">
                      <div className="flex flex-col text-sm ">
                        <span>Payment Method</span>
                        <span className="font-semibold">{data?.trn_method}</span>
                      </div>
                      <div className="flex flex-col text-sm ">
                        <span>Payment Amount</span>
                        <span className="font-semibold">{formatToDecimal(data?.trn_amount)}</span>
                      </div>
                      
                  </div>

              </div>
              {
                data?.trn_status === "pending" && <DialogFooter className="py-4 flex justify-end">
                <div className="space-x-2 ">
                  <Button
                    variant={"destructive"}
                    type="button"
                    className="text-white mr-auto uppercase"
                    disabled={isLoading}
                    onClick={() => onOpen("reject-reason", {
                      ...data,
                      status: form.getValues('status')
                    })}
                  >
                    Reject
                  </Button>
                  <Button
                    variant={"default"}
                    type="submit"
                    className=" dark:text-white bg-green-600 ml-auto uppercase"
                    disabled={isLoading}
                    onClick={() => form.setValue("status", "completed")}
                  >
                    {(() => {
                      if (isLoading)
                        return (
                          <div className="flex items-center gap-x-3">
                            Loading <Loader2 size={20} />
                          </div>
                        );
                      return "Approve";
                    })()}
                  </Button>
                </div>
              </DialogFooter>
              }
              
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionModal;