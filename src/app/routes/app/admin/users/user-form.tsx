import { useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { IUser } from "@/@types/user";

const formSchema = z.object({
  firstName: z.string().min(2),
  middleName: z.string().optional(),
  lastName: z.string().min(2),
  extensionName: z.string().optional(),
  username: z.string().min(4),
  email: z.string().email(),
  contactNo: z
    .string()
    .length(11, { message: "Contact number must be 11 characters" })
    .optional()
    .or(z.literal("")),
  password: z.string().optional(),
  password2: z.string().optional(),
  role: z.enum(["user", "staff", "admin", "service_engineer"], {
    message: "You need to select a user role.",
  }),
});

export default function AdminUserForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const isUpdate = location.pathname.endsWith("/update");
  const title = isUpdate ? "Update" : "Create";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      extensionName: "",
      username: "",
      email: "",
      password: "",
      password2: "",
    },
  });

  const { data } = useQuery({
    queryKey: ["userForm", params.userId],
    queryFn: async () => {
      let data: IUser = {
        _id: "",
        firstName: "",
        middleName: "",
        lastName: "",
        extensionName: "",
        username: "",
        email: "",
        contactNo: "",
        role: "user",
        isActive: false,
      };
      if (params.userId) {
        const response = await api.get(`/users/${params.userId}`);
        data = response.data?.data ?? response.data;
      }
      return data;
    },
  });

  useEffect(() => {
    if (isUpdate && data) {
      form.setValue("firstName", data.firstName || "");
      form.setValue("middleName", data.middleName || "");
      form.setValue("lastName", data.lastName || "");
      form.setValue("extensionName", data.extensionName || "");
      form.setValue("username", data.username || "");
      form.setValue("email", data.email || "");
      form.setValue("contactNo", data.contactNo || "");
      form.setValue("role", data.role || "user");
    }
  }, [data, isUpdate, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    try {
      if (isUpdate) {
        const updatedData = {
          firstName: data.firstName,
          middleName: data.middleName || null,
          lastName: data.lastName,
          extensionName: data.extensionName || null,
          username: data.username,
          email: data.email,
          contactNo: data.contactNo || null,
          role: data.role,
        };

        const response = await api.put(
          `/users/${params.userId}`,
          updatedData
        );
        if (response.status === 200) {
          toast.success("User updated successfully.", {
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

          navigate("/admin/users");
        } else {
          console.log(response.status);
        }
      } else {
        if (!data.password || data.password.length < 6) {
          form.setError("password", {
            message: "Password must be at least 6 characters.",
          });
          return;
        }
        if (data.password !== data.password2) {
          form.setError("password2", {
            message: "Passwords do not match.",
          });
          return;
        }

        const newUserData = {
          firstName: data.firstName,
          middleName: data.middleName || null,
          lastName: data.lastName,
          extensionName: data.extensionName || null,
          username: data.username,
          email: data.email,
          contactNo: data.contactNo || null,
          password: data.password,
          role: data.role,
          isActive: true,
        };

        const response = await api.post("/users", newUserData);
        if (response.status === 200 || response.status === 201) {
          toast.success("User created successfully.", {
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

          navigate("/admin/users");
        } else {
          console.log(response.status);
        }
      }
    } catch (e) {
      const err = handleAxiosError(e);
      if (err?.key) {
        if (err.key in form.getValues()) {
          form.setError(err.key as keyof z.infer<typeof formSchema>, {
            type: "server",
            message: err.message,
          });
        } else {
          form.setError("root", { type: "server", message: err.message });
        }
      }
    }
  }

  return (
    <section>
      <h3 className="text-xl font-semibold">{title} User</h3>
      <div className="mt-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 lg:w-6/12 md:w-7/12 sm:w-full"
          >
            <Label className="text-gray-500">User Information</Label>
            <div className="grid lg:grid-cols-4 sm:grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
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
                        value={field.value || ""}
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
                      <Input {...field} className="h-7" />
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
                    <FormLabel>Extension Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        className="h-7"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-7" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" className="h-7" />
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
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          type="contactNo"
                          className="h-7"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-4">
              {!isUpdate && (
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" className="h-7" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password Confirmation</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" className="h-7" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>User Role</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-wrap space-y-1 gap-6"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="user" />
                            </FormControl>
                            <FormLabel className="font-normal">User</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="staff" />
                            </FormControl>
                            <FormLabel className="font-normal">Staff</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="service_engineer" />
                            </FormControl>
                            <FormLabel className="font-normal">Service Engineer</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="admin" />
                            </FormControl>
                            <FormLabel className="font-normal">Admin</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
