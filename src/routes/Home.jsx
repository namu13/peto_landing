import "../App.css";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";
import { CountUp } from "countup.js";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  projectName: z.string().min(1, { message: "Please fill out Project name." }),
  shortDescription: z
    .string()
    .min(1, { message: "Please fill out short description." })
    .max(1000, { message: "Please write less than 1000 letter." }),
  lab: z.string({ required_error: "Please select lab." }),
  teamCompany: z.string().min(1, { message: "Please fill out Team company." }),
  topic: z.string({ required_error: "Please select topic." }),
  // hashTag: z.string({ required_error: "Please fill out hashTag." }),
  memberEmail_1: z
    .string({ required_error: "Please fill out email." })
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    }),
  memberEmail_2: z
    .string({ required_error: "Please fill out email." })
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    }),
  memberEmail_3: z
    .string()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
  memberEmail_4: z
    .string()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
  memberEmail_5: z
    .string()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
  memberEmail_6: z
    .string()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
  memberEmail_7: z
    .string()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
  memberEmail_8: z
    .string()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
});

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  // Counter variable
  const countupRef = useRef(null);
  let countUpAnim;

  useEffect(() => {
    initCountUp();
  }, []);

  const initCountUp = () => {
    countUpAnim = new CountUp(countupRef.current, 241, { duration: 3 });
    if (!countUpAnim.error) {
      countUpAnim.start();
    } else {
      console.error(countUpAnim.error);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      shortDescription: "",
      teamCompany: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const value = validEmail(values);
      setLoading(true);
      const doc = await addDoc(collection(db, "projects"), {
        ...value,
        createdAt: Date.now(),
      });
      if (file) {
        const locationRef = ref(storage, `projects/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          image: url,
        });
      }
      form.reset();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const validEmail = (obj) => {
    let emailKeys = Object.keys(obj).filter((key) =>
      key.startsWith("memberEmail")
    );
    let validEmails = emailKeys
      .map((key) => obj[key])
      .filter((email) => email !== undefined);
    obj["memberEmail"] = validEmails;
    emailKeys.forEach((key) => delete obj[key]);

    return obj;
  };

  const onImageChange = (e) => {
    const { files } = e?.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };
  return (
    <div className="flex flex-col justify-start items-center w-full h-full px-10 xl:px-40 lg:border lg:border-white">
      <section className="lg:mt-10">
        <div className="flex justify-center items-center gap-2 mb-10 lg:mb-16">
          <img src="src/assets/peto.svg" width={40} />
          <span className="text-peto font-bold text-3xl lg:text-4xl">PETO</span>
        </div>
        <h1 className="text-white text-center font-peto font-bold text-3xl mb-2 lg:mb-4 lg:text-7xl">
          LET’S DREAM <br />
          TOGETHER
        </h1>

        <p className="text-white text-center text-xl lg:text-4xl">
          <div className="inline-block text-end w-12 lg:w-24">
            <span
              ref={countupRef}
              className="text-peto font-bold text-2xl lg:text-5xl"
            >
              0
            </span>
          </div>{" "}
          Projects are Dreaming
        </p>
        <div className="flex flex-col items-center mt-12 mb-10 lg:mb-16">
          <Button className="px-12 text-xl font-bold rounded-[6px] border-none">
            Register
          </Button>
          <Button variant="link" className="bg-black border-none mt-2">
            View projects
          </Button>
        </div>
      </section>
      <Separator className="bg-white" />
      <section className="w-full mt-10 lg:mt-24">
        <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between">
          <img src="src/assets/star.svg" width={45} />
          <h2 className="text-4xl font-peto font-bold">INFORMATION</h2>
          <img src="src/assets/star.svg" width={45} />
        </div>
        <div className="flex justify-center items-center gap-2 lg:mt-12">
          <img
            src="src/assets/peto_white.svg"
            width={40}
            className="hidden lg:flex"
          />
          <span className="font-bold font-peto text-3xl lg:text-4xl lg:font-sans">
            PETO
          </span>
        </div>
        <div className="flex flex-col items-center mt-5 lg:px-10">
          <p className="text-xl lg:text-center">
            “PETO” means to seek for and to reach towards. We aim to build a
            platform for you to easily seek opportunities inside LEINN.
            Moreover, reach towards and boost your vision with reliable
            teammates.
          </p>
          <p className="text-xl lg:text-center mt-3">
            Our platform has three main functions: project card, vision friend,
            and calendly.
          </p>
        </div>
        <div className="grid mt-12 grid-cols-[270px_270px_270px] lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:gap-5">
          <div className="lg:col-span-full bg-black border border-white rounded-2xl px-8 pt-10">
            <div className="grid grid-cols-2 h-full">
              <div>
                <span className="text-3xl font-peto font-bold">
                  PROJECT CARD
                </span>
                <p className="mt-3">
                  In the Project card page the project will be categorized by
                  two standards: location and topic. By this function, you can
                  check where projects are operated and the main topic of the
                  project.When you click the project that interests you, you can
                  also get more information about the project such as target
                  audience, business model, and go to market strategy.
                </p>
              </div>
              <div className="w-full h-[500px] self-end overflow-hidden">
                <img
                  src="/src/assets/project.jpg"
                  width={550}
                  className="m-auto"
                />
              </div>
            </div>
          </div>
          <div className=" bg-black border border-white rounded-2xl px-12 pt-14">
            <div>
              <span className="text-3xl font-peto font-bold">
                VISION FRIEND
              </span>
              <p className="mt-3">
                Vision Friend is a page with a list of visions. You interact
                with other students with the same vision by pressing like and
                commenting below. Additionally, you can build a project with a
                vision friend with a shared vision.
              </p>
            </div>
            <div className="w-full h-72 overflow-hidden mt-10">
              <img src="/src/assets/vision_friend.jpg" />
            </div>
          </div>
          <div className="bg-black border border-white rounded-2xl px-12 pt-14">
            <span className="text-3xl font-peto font-bold">MEET UP!</span>
            <p className="mt-3">
              Calendly may sound familiar to you. You can book a meeting with a
              project you find interesting. From this function, you can get
              useful advice and feedback for your project and even collaborate
              with the following project.
            </p>
            <div className="w-full h-80 overflow-hidden mt-4">
              <img src="/src/assets/detail.jpg" width={550} />
            </div>
          </div>
        </div>
      </section>
      <section id="form" className="w-full lg:mt-24">
        <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between">
          <img src="src/assets/star.svg" width={45} />
          <h2 className="text-4xl font-peto font-bold">REGISTER</h2>
          <img src="src/assets/star.svg" width={45} />
        </div>
        <Separator className="bg-white mb-2 mt-10 lg:mb-10 lg:mt-24" />
        <h2 className="text-2xl mt-4 font-peto lg:hidden">Register</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="lg:grid grid-cols-[1fr_2fr] lg:grid-rows-[repeat(auto-fit, minmax(0,max-content))]">
              <span className="hidden lg:text-3xl lg:font-peto lg:flex">
                Project
              </span>
              <div>
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem className="mt-6 lg:mt-0">
                      <FormLabel className="lg:text-lg">Project name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type your project name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem className="mt-5">
                      <FormLabel className="lg:text-lg">
                        Short description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Give us a short introduction about your project"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="hidden lg:bg-white lg:mb-10 lg:mt-10 lg:col-span-full lg:flex" />
              <span className="hidden lg:text-3xl lg:font-peto lg:flex">
                Information
              </span>
              <div className="lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-x-6 lg:gap-y-5">
                <FormField
                  control={form.control}
                  name="lab"
                  render={({ field }) => (
                    <FormItem className="mt-5 lg:mt-0">
                      <FormLabel className="lg:text-lg">Lab</FormLabel>
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
                  name="teamCompany"
                  render={({ field }) => (
                    <FormItem className="mt-5 lg:mt-0">
                      <FormLabel className="lg:text-lg">Team Company</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add Name of your Team company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem className="mt-5 lg:mt-0">
                      <FormLabel className="lg:text-lg">Topic</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Culture">Culture</SelectItem>
                          {/* <SelectItem value="Bilbao">Bilbao</SelectItem> */}
                          {/* <SelectItem value="Madrid">Madrid</SelectItem> */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* <FormField
                  control={form.control}
                  name="hashTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">Hashtag</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type your hashtag and click enter."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="hidden lg:flex lg:flex-col">
                      <FormLabel className="text-lg">
                        Logo or main photo
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          {...field}
                          onChange={onImageChange}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator className="hidden lg:bg-white mt-10 mb-10 lg:col-span-full lg:flex" />
              <span className="hidden lg:text-3xl lg:font-peto lg:flex">
                Contact
              </span>
              <div className="mt-5 lg:mt-0 lg:grid lg:grid-cols-2 lg:gap-x-6">
                <FormField
                  control={form.control}
                  name="memberEmail_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="lg:text-lg">
                        Team members' Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add Email of your Team member"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memberEmail_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="lg:text-lg invisible">
                        Team members' Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add Email of your Team member"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memberEmail_3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="invisible">
                        Team members' Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add Email of your Team member"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memberEmail_4"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="invisible">
                        Team members' Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add Email of your Team member"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memberEmail_5"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="invisible">
                        Team members' Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add Email of your Team member"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memberEmail_6"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="invisible">
                        Team members' Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add Email of your Team member"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memberEmail_7"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="invisible">
                        Team members' Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add Email of your Team member"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="memberEmail_8"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="invisible">
                        Team members' Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Add Email of your Team member"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="w-full flex justify-center mt-12 mb-10">
              {loading ? (
                <Button
                  disabled
                  className="text-xl font-bold px-12 rounded-[6px]"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="border-none text-xl font-bold px-12 rounded-[6px]"
                >
                  Register
                </Button>
              )}
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};

export default Home;
