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
  useQueryProcessor,
  // useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { useToast } from "@/hooks/use-toast"
import { Badge } from "../ui/badge";
import { formatToDecimal, formatToReadableDate } from "@/lib/numberFormatter";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { File, SquareArrowOutUpLeft, SquareArrowOutUpRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
// import { CreateClientSchema } from "schema/client";
// import axios from "axios";
// import { useRouter } from "next/router";

const WalletModal = () => {
  const { isOpen, type, onClose, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "wallet-modal";
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

  const onSubmit = async (values) => {
    
  };

  const {data: userData} = useQueryProcessor({
    url: `/user/${data?.villwall_trn_link}`,
    key: ['user', data?.villwall_trn_link],
    options: {
      enabled: isOpen 
    }
  })
  
  console.log()
  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose}>
        <DialogContent className="max-h-[95vh] max-w-[90vw] md:w-[550px] border-none overflow-y-auto bg-cello bg-white text-slate-800 ">
          <DialogHeader className="pt-3 ">
            <DialogTitle className="text-xl text-left font-bold ">
              Wallet Transaction History <span className="text-md "># {data?.villwall_trn_id}</span> 
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="w-full mt-5 grid  grid-rows-1 space-y-3">
                  <div className="flex justify-between flex-col space-y-2">
                      <div className="flex flex-col text-sm ">
                        <span className="font-semibold">Transaction Date</span>
                        <span >{formatToReadableDate(data?.villwall_trn_created_at || new Date())}</span>
                      </div>

                      <div className="flex flex-col text-sm ">
                        <span className="font-semibold flex">Made by</span>
                        <span > {userData?.usr_username || "ADMIN"}</span>
                      </div>

                      <div className="flex flex-col text-sm ">
                        <span  className="font-semibold">Type </span>
                       <span>{data?.villwall_trn_type}</span>
                      </div>

                      <div className="flex flex-col text-sm ">
                        <span className="font-semibold">Amount </span>
                        <span >{ formatToDecimal(data?.villwall_trn_amt)}</span>
                      </div>

                      <div className="flex flex-col text-sm ">
                        <span className="font-semibold">Description </span>
                        <span >{data?.villwall_trn_description || "No Description"}</span>
                      </div>

                  </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletModal;