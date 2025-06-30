import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import api from "@/hooks/use-api";
import { handleAxiosError } from "@/utils/error-handler";

import { useQuery } from "@tanstack/react-query";

import { toast, Slide } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { IOffice } from "@/@types/office";
import { officeTypes } from "@/data/office-types";

const formSchema = z.object({
  name: z.string().min(2),
  alias: z.string(),
  officeType: z.string({ message: "Please select an office type." }),
});

export default function AdminOfficeForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const currentPath = location.pathname.split("/");

  const [errors, setErrors] = useState<any>(null);

  let isUpdate = false;

  let title = "";
  if (currentPath[currentPath.length - 1] === "create") {
    title = "Create";
  } else if (currentPath[currentPath.length - 1] === "update") {
    title = "Update";
    isUpdate = true;
  }

  const { data } = useQuery({
    queryKey: ["officeForm"],
    queryFn: async () => {
      let data: IOffice = {
        _id: "",
        name: "",
        alias: "",
        officeType: "",
      };
      let url = `/api/offices/${params.officeId}`;
      if (params.officeId) {
        await api.get(url).then((response) => {
          data = response.data;
        });
      }
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      alias: "",
      officeType: "",
    },
  });

  useEffect(() => {
    let officeType = officeTypes.find((e) => e.value === data?.officeType);
    console.log(officeType);

    if (isUpdate) {
      form.setValue("name", data ? data.name : "");
      form.setValue("alias", data ? (data.alias ? data.alias : "") : "");
      form.setValue("officeType", data ? data.officeType : "");
    }
  }, [data]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // console.log(data)
    try {
      if (isUpdate) {
        const response = await api.put(`/api/offices/${params.officeId}`, data);
        if (response.status === 200) {
          toast.success(`${data?.name} is updated successfully.`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
            className: "text-sm",
          });

          navigate("/admin/offices");
        } else {
          console.log(response.status);
        }
      } else {
        const response = await api.post("/api/offices", data);
        if (response.status === 201) {
          toast.success(`${data?.name} is created successfully.`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Slide,
            className: "text-sm",
          });

          navigate("/admin/offices");
        } else {
          console.log(response.status);
        }
      }
    } catch (e) {
      const err = await handleAxiosError(e);
      let obj: any = {};
      obj[err.key] = err.message;
      setErrors(obj);
    }
  }

  return (
    <section>
      <h3 className="text-xl font-semibold">{title} Office</h3>
      <div className="mt-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 lg:w-6/12 md:w-7/12 sm:w-full"
          >
            <Label className="text-gray-500">Office Information</Label>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={errors?.name ? "text-red-500" : ""}>
                      Office Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage>{errors?.name}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alias</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="officeType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Office Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-7">
                          {isUpdate ? (
                            <SelectValue
                              placeholder={
                                field.value.charAt(0).toUpperCase() +
                                field.value.slice(1)
                              }
                            />
                          ) : (
                            <SelectValue placeholder="Please select an office type" />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {officeTypes.map((officeType) => (
                          <SelectItem
                            key={officeType.value}
                            value={officeType.value}
                          >
                            {officeType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="bg-blue-500">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
