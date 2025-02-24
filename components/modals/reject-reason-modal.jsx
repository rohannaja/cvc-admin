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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useModal } from "@/hooks/useModalStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { useMutateProcessor } from "@/hooks/useTanstackQuery";
import { useForm } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea"
import { CookingPot } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query";
const RejectReasonModal = () => {
  const { isOpen, type, onClose, data, onOpen } = useModal();
  const isModalOpen = isOpen && type === "reject-reason";
  const onHandleClose = () => {
    onClose();
  };

  const form = useForm({
    defaultValues: {
        reason: "",
        status:"rejected"
    },
    mode: "all",
  });
  const { toast } = useToast()
  const completeRequest = useMutateProcessor({
    url: `/transaction/update-status/${data?.trn_id}`,
    key: ["transactions", data?.trn_id],
    method: "PUT",
  });

  const isLoading =
    form.formState.isSubmitting || completeRequest.status === "pending";

  useEffect(() => {
    return () => {
      form.reset();
    };
  }, [isModalOpen]);

  const router = useRouter()

    const queryClient = useQueryClient()
    
  const onSubmit = async (values) => {
    completeRequest.mutate(values, {
      onSuccess: (data) => {
        console.log(data)
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

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={onHandleClose} >
        <DialogContent className="border-none max-h-[95vh] max-w-[90vw] md:w-[550px] overflow-y-auto bg-cello bg-white">
          <DialogHeader className="pt-3 px-6">
            <DialogTitle className="text-2xl text-center font-bold m-2 text-slate-600">
              Reason
            </DialogTitle>

          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="w-full mt-5">
              <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Reason (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Reject reason"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
              </div>
              <DialogFooter className="w-full py-4 flex justify-evenly">
              <Button
                  variant={"ghost"}
                  className=" text-black "
                  type="button"
                  disabled={isLoading}
                  onClick={() => onOpen("transaction-modal", data)}
                >
                  Cancel
                </Button>

                <Button
                  variant={"default"}
                  type="submit"
                  className=" text-white bg-red-600 hover:bg-red-700"
                  disabled={isLoading}
                >
                  {(() => {
                    if (isLoading)
                      return (
                        <div className="flex items-center gap-x-3">
                          {" "}
                          Saving <Loader2 size={20} />
                        </div>
                      );
                    return "REJECT";
                  })()}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RejectReasonModal;