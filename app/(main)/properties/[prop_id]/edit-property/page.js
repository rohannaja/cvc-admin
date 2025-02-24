"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// styles
import properties from "../../properties.module.css";
import editprop from "./editprop.module.css";

// assets
import backBtn from "@/public/svg/backbtn.svg";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useMutateProcessor,
  useQueryProcessor,
} from "@/hooks/useTanstackQuery";
import { useToast } from "@/hooks/use-toast";
import { Download, X } from "lucide-react";
import { dataURItoBlob, uploadPhoto } from "@/lib/utils";
export default function EditProperty() {
  const [propertyData, setPropertyData] = useState(null);
  const params = useParams(); // Use useParams to get dynamic route params
  const prop_id = params.prop_id; // Get prop_id from the URL

  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      lot: "",
      street: "",
      homeOwnerId: "",
    },
    mode: "all",
  });
  form.watch(["image"]);
  const updateProperty = useMutateProcessor({
    url: `/property/${prop_id}`,
    method: "PUT",
    key: ["property", prop_id],
  });

  const onSubmit = async (values) => {
    let image;
    if(values.image) {
      const { url } = await uploadPhoto(
        dataURItoBlob(values.image) 
      );
      image = url
    }
    

    updateProperty.mutate({...values, image}, {
      onError: (error) => {
        console.log(error);
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      },
      onSettled: (data) => {},
      onSuccess: (data) => {
        toast({
          title: "Status update",
          description: "The property has been updated",
        });
        router.push(`/properties/${prop_id}`)
      },
    });
  };

  const { data: users, status } = useQueryProcessor({
    url: "/user",
    queryParams: {
      role: "homeowner",
    },
    key: ["users", "homeowner"],
  });

  useEffect(() => {
    if (prop_id) {
      // Determine the API URL based on the environment
       
      // Make sure the endpoint matches your API route
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/properties/${prop_id}`)
        .then((res) => res.json())
        .then((data) => setPropertyData(data))
        .catch((error) =>
          console.error("Error fetching property data:", error)
        );
    }
  }, [prop_id]); // Re-run the effect when prop_id changes

  if (!propertyData) {
    return <div>No property data retrieved.</div>;
  }

  return (
    <div className={properties.main_content_container}>
      <div className={editprop.main_content_div}>
        {!showSummaryModal && !isProcessing && (
          <>
            <div className={editprop.content_div_cta_row}>
              <Link
                href={`/properties/${prop_id}`}
                className={editprop.backbtn_cont}
              >
                <div className={editprop.backbtn_img_div}>
                  <Image src={backBtn} alt="Back Icon" height={25} width={25} />
                </div>
                <p>Back</p>
              </Link>
            </div>

            <div className={editprop.main_content_title_div}>
              <h3 className={editprop.content_title}>Edit Property</h3>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <section className="grid grid-cols-2 space-x-10 px-10">
                  <div
                    className={
                      "flex flex-col gap-y-5 justify-center items-center"
                    }
                  >
                    {(() => {
                      const value = form.getValues("image");
                      if (!value) {
                        return (
                          <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <label
                                  htmlFor="upload"
                                  className=" hover:bg-zinc-200 w-[60%] transition-all m-auto cursor-pointer py-5 border-zinc-300 border-2 rounded-lg flex flex-col justify-center items-center gap-5 "
                                >
                                  <Download className=" text-gray-400 ml-2 h-10 w-10 " />
                                  <span className="text-[#42579E] text-sm font-semibold">
                                    Choose a file
                                  </span>
                                  <span className="text-xs text-zinc-500 font-semibold">
                                    Photo (png, jpg, etc)
                                  </span>
                                </label>
                                <FormControl>
                                  <Input
                                    className="hidden"
                                    id="upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      if (e?.target?.files?.[0]) {
                                        const reader = new FileReader();
                                        reader.readAsDataURL(
                                          e?.target?.files?.[0]
                                        );

                                        reader.onloadend = () => {
                                          field.onChange(reader.result);
                                        };
                                      } else {
                                        field.onChange("");
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                      }

                      return (
                        <div className="relative h-[250px] w-[500px] mt-10 mx-auto border rounded-xl overflow-hidden">
                          <Image
                            src={value}
                            alt="House Photo"
                            layout="responsive"
                            width={500}
                            height={280}
                            className="object-cover"
                          />
                          <button
                            className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                            type="button"
                          >
                            <X
                              className="h-4 w-4"
                              onClick={() => form.setValue("image", "")}
                            />
                          </button>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex flex-col space-y-5">
                    <FormField
                      control={form.control}
                      name="homeOwnerId"
                      render={({ field }) => (
                        <FormItem className="text-black ">
                          <FormLabel className="font-semi-bold">
                            Owner
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a home owner" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {users?.map((user) => (
                                <SelectItem value={user?.usr_id}>
                                  {user?.usr_first_name} {user?.usr_last_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lot"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Lot</FormLabel>
                          <FormControl>
                            <Input placeholder="Lot" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Street</FormLabel>
                          <FormControl>
                            <Input placeholder="Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
                <div className="flex justify-end p-10 space-x-5">
                  <Button
                    type="button"
                    className=""
                    variant="ghost"
                    onClick={() => {
                      router.back();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="">
                    Update Property
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  );
}
