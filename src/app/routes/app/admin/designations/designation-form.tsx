import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/lib/api-client";
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

import { IDesignation } from "@/@types/designation";

const formSchema = z.object({
  name: z.string().min(2, "Position title must be at least 2 characters."),
});

export default function AdminDesignationForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const isUpdate = location.pathname.endsWith("/update");
  const title = isUpdate ? "Update" : "Create";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { data } = useQuery({
    queryKey: ["designationForm", params.designationId],
    queryFn: async () => {
      let data: IDesignation = {
        _id: "",
        name: "",
      };
      const url = `/api/designations/${params.designationId}`;
      if (params.designationId) {
        await api.get(url).then((response) => {
          data = response.data?.data ?? response.data;
        });
      }
      return data;
    },
    enabled: Boolean(params.designationId),
  });

  useEffect(() => {
    if (isUpdate && data) {
      form.setValue("name", data.name || data.title || "");
    }
  }, [data, isUpdate, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // console.log(data)
    try {
      if (isUpdate) {
        const response = await api.put(
          `/api/designations/${params.designationId}`,
          data
        );
        if (response.status === 200) {
          toast.success(`${data.name} is updated successfully.`, {
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

          navigate("/admin/designations");
        } else {
          console.log(response.status);
        }
      } else {
        const response = await api.post("/api/designations", data);
        if (response.status === 201) {
          toast.success(`${data.name} is created successfully.`, {
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

          navigate("/admin/designations");
        } else {
          console.log(response.status);
        }
      }
    } catch (e) {
      const err = handleAxiosError(e);
      if (err) {
        if (err.key === "name" || err.key === "title") {
          form.setError("name", { type: "server", message: err.message });
        } else {
          form.setError("root", { type: "server", message: err.message });
        }
      }
    }
  }

  return (
    <section>
      <h3 className="text-xl font-semibold">{title} Designation</h3>
      <div className="mt-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 lg:w-6/12 md:w-7/12 sm:w-full"
          >
            <Label className="text-gray-500">Designation Information</Label>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Position Title
                    </FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {form.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.root.message}
              </p>
            )}
            <Button type="submit" className="bg-blue-500">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
