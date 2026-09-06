import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import api from "@/hooks/use-api";
import { handleAxiosError } from "@/utils/error-handler";
import { DesignationComboBox } from "@/features/designations";
import { OfficeComboBox } from "@/features/offices";

import { useQuery } from "@tanstack/react-query";

import { toast } from "sonner";
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

import { IClient } from "@/@types/client";
import { IOffice } from "@/@types/office";
import { IDesignation } from "@/@types/designation";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().nullable().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  extensionName: z.string().nullable().optional(),
  contactNo: z.string().nullable().optional(),
  email: z.string().email({ message: "Invalid email address" }).nullable().optional().or(z.literal("")),
});

export default function AdminClientForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchDesignation, setSearchDesignation] = useState("");
  const [searchOffice, setSearchOffice] = useState("");
  const [previousDesignation, setPreviousDesignation] = useState("");
  const [previousOffice, setPreviousOffice] = useState("");
  const currentPath = location.pathname.split("/");

  let isUpdate = false;

  let title = "Create";
  if (currentPath[currentPath.length - 1] === "update") {
    title = "Update";
    isUpdate = true;
  }

  const { data } = useQuery<IClient | null>({
    queryKey: ["clientForm", params.clientId],
    queryFn: async () => {
      if (!params.clientId) return null;
      const response = await api.get(`/clients/${params.clientId}`);
      return response.data?.data ?? response.data;
    },
    enabled: Boolean(params.clientId),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      extensionName: "",
      contactNo: "",
      email: "",
    },
  });

  useEffect(() => {
    if (isUpdate && data) {
      form.setValue("firstName", data.firstName || "");
      form.setValue("middleName", data.middleName || "");
      form.setValue("lastName", data.lastName || "");
      form.setValue("extensionName", data.extensionName || "");
      form.setValue("contactNo", data.contactNo || "");
      form.setValue("email", data.email || "");

      const office = data.office as IOffice | undefined;
      const designation = data.designation as IDesignation | undefined;

      const officeLabel = office?.code
        ? `${office.code} - ${office.name}`
        : office?.name || office?.alias || "";
      const designationLabel = designation?.name || designation?.title || "";

      if (officeLabel) setPreviousOffice(officeLabel);
      if (designationLabel) setPreviousDesignation(designationLabel);

      if (data.officeId) setSearchOffice(String(data.officeId));
      if (data.designationId) setSearchDesignation(String(data.designationId));
    }
  }, [data, isUpdate, form]);

  async function onSubmit(d: z.infer<typeof formSchema>) {
    try {
      const officeId = searchOffice
        ? Number(searchOffice)
        : data?.officeId || null;
      const designationId = searchDesignation
        ? Number(searchDesignation)
        : data?.designationId || null;

      const payload = {
        firstName: d.firstName.trim().toUpperCase(),
        middleName: d.middleName?.trim() ? d.middleName.trim().toUpperCase() : null,
        lastName: d.lastName.trim().toUpperCase(),
        extensionName: d.extensionName?.trim()
          ? d.extensionName.trim().toUpperCase()
          : null,
        contactNo: d.contactNo || null,
        email: d.email ? d.email.trim().toLowerCase() : null,
        officeId,
        designationId,
      };

      if (isUpdate) {
        const id = data?.id ?? data?._id ?? params.clientId;
        const response = await api.put(`/clients/${id}`, payload);
        if (response.status === 200) {
          toast.success(
            `${payload.firstName} ${payload.lastName} updated successfully.`
          );
          navigate("/admin/clients");
        }
      } else {
        const response = await api.post(`/clients`, payload);
        if (response.status === 200 || response.status === 201) {
          toast.success(
            `${payload.firstName} ${payload.lastName} created successfully.`
          );
          navigate("/admin/clients");
        }
      }
    } catch (e) {
      const err = handleAxiosError(e);
      if (err) {
        if (
          [
            "firstName",
            "middleName",
            "lastName",
            "extensionName",
            "contactNo",
            "email",
          ].includes(err.key)
        ) {
          form.setError(err.key as keyof z.infer<typeof formSchema>, {
            type: "server",
            message: err.message,
          });
        } else {
          form.setError("root", { type: "server", message: err.message });
        }
      } else {
        toast.error("Operation failed.");
      }
    }
  }

  return (
    <section>
      <h3 className="text-xl font-semibold">{title} Client</h3>
      <div className="mt-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 lg:w-6/12 md:w-9/12 sm:w-full"
          >
            <Label className="text-gray-500">Client Information</Label>
            <div className="grid lg:grid-cols-4 md:grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value.toUpperCase()}
                        className="h-7"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value?.toUpperCase() || ""}
                        className="h-7"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value.toUpperCase()}
                        className="h-7"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="extensionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ext. Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value?.toUpperCase() || ""}
                        className="h-7"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        type="email"
                        placeholder="client@agency.gov.ph"
                        className="h-7"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact No.</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        placeholder="09123456789"
                        className="h-7"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-4">
              <div className="grid grid-cols-1 gap-2">
                <span className="text-sm font-medium">Designation</span>
                <DesignationComboBox
                  className="h-7"
                  defaultValue={searchDesignation}
                  previousValue={previousDesignation}
                  onValueChange={(value: string) => {
                    setSearchDesignation(value);
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <span className="text-sm font-medium">Office</span>
                <OfficeComboBox
                  className="h-7"
                  defaultValue={searchOffice}
                  previousValue={previousOffice}
                  onValueChange={(value: string) => {
                    setSearchOffice(value);
                  }}
                />
              </div>
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
