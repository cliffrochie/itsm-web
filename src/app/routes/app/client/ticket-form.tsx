import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { taskTypes } from "@/data/task-types";
import { equipmentTypes } from "@/data/equipment-types";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { ClientComboBox, AddClientDialog } from "@/features/clients";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api-client";
import { handleAxiosError } from "@/utils/error-handler";
import { Slide, toast } from "react-toastify";
import { formatParagraph } from "@/utils";
import { useAuthStore } from "@/stores/authStore";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(1, { message: "This field is required." }),
  equipmentType: z.string().min(1, { message: "This field is required." }),
  taskType: z.string().min(1, { message: "This field is required." }),
  natureOfWork: z.string().min(1, { message: "This field is required." }),
  client: z.string().min(1, { message: "This field is required." }),
});

export default function ClientTicketForm() {
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const [clientSearch, setClientSearch] = useState("");
  const [previousClient, setPreviousClient] = useState("");
  const [addClientDialogOpen, setAddClientDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      equipmentType: "",
      taskType: "",
      natureOfWork: "",
      client: "",
    },
  });

  useEffect(() => {
    if (clientSearch) {
      console.log(clientSearch);
      form.setValue("client", clientSearch);
    }
  }, [clientSearch, form]);

  useEffect(() => {
    if (authUser) {
      async function get() {
        try {
          const userId = authUser?.id ?? (authUser as { _id?: string | number })?._id;
          const response = await api.get("/clients", {
            params: { userId, limit: 1 },
          });
          const client = response.data?.data?.[0];
          if (client) {
            setClientSearch(String(client.id ?? client._id));
          }
        } catch (e) {
          console.error("Error fetching client details:", e);
        }
      }
      get();

      let fullName = authUser.firstName || "";
      if (authUser.middleName) {
        fullName += " " + authUser.middleName.charAt(0) + ". ";
      } else {
        fullName += " ";
      }
      fullName += authUser.lastName || "";
      setPreviousClient(fullName.trim());
    }
  }, [authUser]);

  const addClientMutation = useMutation({
    mutationKey: ["addClientMutation"],
    mutationFn: async (data: string) => {
      const parsedData = JSON.parse(data);
      const body = {
        firstName: parsedData.firstName,
        middleName: parsedData.middleName || null,
        lastName: parsedData.lastName,
        extensionName: parsedData.extensionName || null,
        designationId: parsedData.designation
          ? Number(parsedData.designation)
          : null,
        officeId: parsedData.office ? Number(parsedData.office) : null,
        userId: authUser?.id ? Number(authUser.id) : null,
      };
      return await api.post(`/clients`, body);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["", "clientComboBox"] });
      toast.success(`Client added successfully.`, {
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
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const payload = {
        title: data.title,
        equipmentType: data.equipmentType,
        taskType: data.taskType,
        natureOfWork: data.natureOfWork,
        clientId: Number(data.client),
      };
      const response = await api.post("/service-tickets", payload);
      if (response.status === 201 || response.status === 200) {
        const ticketNo =
          response.data?.data?.ticketNo ||
          response.data?.ticketNo ||
          "Service ticket";
        toast.success(`${ticketNo} is created successfully.`, {
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

        navigate("/client");
      } else {
        toast.error(`Something went wrong.`, {
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
      }
    } catch (e) {
      const err = handleAxiosError(e);
      if (err) {
        if (
          [
            "title",
            "equipmentType",
            "taskType",
            "natureOfWork",
            "client",
          ].includes(err.key)
        ) {
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
    <div className="">
      <div className="mt-4">
        <div className="py-4 font-semibold">REQUEST SERVICE</div>
        <div className="flex justify-center w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Services</CardTitle>
              <CardDescription>
                Please provide an information that corresponds to the
                issue/concern you are currently facing, an IT Personnel will be
                with you shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-4"
                  id="ticketForm"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What is your concern?</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              const { value } = e.target;
                              field.onChange(formatParagraph(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid custom-md:grid-cols-2 grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="equipmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Which device?</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="----" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {equipmentTypes.map((equipmentType) => (
                                <SelectItem
                                  key={equipmentType.value}
                                  value={equipmentType.value}
                                >
                                  {equipmentType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="taskType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What type of service?</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="">
                                <SelectValue placeholder="----  " />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {taskTypes.map((taskType) => (
                                <SelectItem
                                  key={taskType.value}
                                  value={taskType.value}
                                >
                                  {taskType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="natureOfWork"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Please provide additional information about your
                          concern that may help our IT personnel.
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="h-24"
                            placeholder=""
                            onChange={(e) => {
                              const { value } = e.target;
                              field.onChange(formatParagraph(value));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Concerning person (requestor/client)
                        </FormLabel>
                        <div className="relative custom-md:w-1/2 custom-sm:w-full">
                          <FormControl>
                            <>
                              <ClientComboBox
                                className=""
                                selectItemMsg="----"
                                defaultValue={clientSearch}
                                previousValue={previousClient}
                                onValueChange={(value: string) => {
                                  setClientSearch(value);
                                }}
                              />
                              <Input {...field} className="hidden" />
                            </>
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            className="absolute right-1 top-1 h-[calc(100%-0.5rem)] px-4 bg-white text-gray-500"
                            onClick={() => setAddClientDialogOpen(true)}
                          >
                            <Plus />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="submit"
                      className="bg-blue-500"
                      form="ticketForm"
                    >
                      Submit
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/client");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddClientDialog
        dialogOpen={addClientDialogOpen}
        setDialogOpen={setAddClientDialogOpen}
        name="Add new client to the list"
        updateMutation={addClientMutation}
      />
    </div>
  );
}
