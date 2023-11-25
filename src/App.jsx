import "./App.css";
import * as z from "zod";
import Navbar from "./components/Navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
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
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  projectName: z
    .string()
    .min(1, { message: "Please fill out the Project name." }),
  shortDescription: z
    .string()
    .min(1, { message: "Please fill out the short description." })
    .max(500, { message: "Please write less than 500 letter." }),
  lab: z.string({ required_error: "Please select lab." }),
  photo: z.string({ required_error: "Please select image." }),
});

const App = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      shortDescription: "",
    },
  });

  // function jsonToFormData(jsonData) {
  //   const formData = new FormData();

  //   Object.entries(jsonData).forEach(([key, value]) => {
  //     formData.append(key, value);
  //   });

  //   return formData;
  // }

  const onSubmit = (values) => {
    console.log(values);

    // const formData = jsonToFormData(values);

    // fetch("/", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   body: new URLSearchParams(formData).toString(),
    // })
    //   .then(() => console.log("Form successfully submitted"))
    //   .catch((error) => alert(error));
  };
  return (
    <main className="bg-black w-screen h-screen p-20">
      <Navbar />
      <Form {...form} data-netlify="true">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="projectName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Project name</FormLabel>
                <FormControl>
                  <Input placeholder="Type your project name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Short description</FormLabel>
                <FormControl>
                  <Input placeholder="Type your description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lab"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Lab</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your lab" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LEINN International">
                      LEINN International
                    </SelectItem>
                    <SelectItem value="Bilbao">Bilbao</SelectItem>
                    <SelectItem value="Madrid">Madrid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Logo or main photo</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </main>
  );
};

export default App;
