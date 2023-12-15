import "../App.css";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Validation
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// JS Library
import { CountUp } from "countup.js";
import jump from "jump.js";
import { motion } from "framer-motion";

// firebase
import {
  addDoc,
  collection,
  getCountFromServer,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/firebase";

// image assets
import logo from "../assets/peto.svg";
import logo_white from "../assets/peto_white.svg";
import star from "../assets/star.svg";
import card_project from "../assets/project.jpg";
import card_visionFriend from "../assets/vision_friend.jpg";
import card_detail from "../assets/detail.jpg";
import sticker_1 from "../assets/sticker_1.svg";
import sticker_2 from "../assets/sticker_2.svg";
import sticker_3 from "../assets/sticker_3.svg";
import sticker_4 from "../assets/sticker_4.svg";
import sticker_5 from "../assets/sticker_5.svg";
import sticker_6 from "../assets/sticker_6.svg";
import sticker_7 from "../assets/sticker_7.svg";
import sticker_8 from "../assets/sticker_8.svg";

// shed cn ui
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  projectName: z.string().min(1, { message: "Please fill out Project name." }),
  shortDescription: z
    .string()
    .min(1, { message: "Please fill out short description." })
    .max(1000, { message: "Please write less than 1000 letter." }),
  lab: z.string({ required_error: "Please select lab." }),
  teamCompany: z.string().min(1, { message: "Please fill out Team company." }),
  status: z.string({ required_error: "Please select status." }),
  topic: z.string({ required_error: "Please select topic." }),
  other: z.string().optional(),
  personalData: z.boolean({
    coerce: false,
  }),
  memberEmail_1: z.string({ required_error: "Please fill out email." }).email(),
  memberEmail_2: z.string({ required_error: "Please fill out email." }).email(),
  memberEmail_3: z.string().email().optional().or(z.literal("")),
  memberEmail_4: z.string().email().optional().or(z.literal("")),
  memberEmail_5: z.string().email().optional().or(z.literal("")),
  memberEmail_6: z.string().email().optional().or(z.literal("")),
  memberEmail_7: z.string().email().optional().or(z.literal("")),
  memberEmail_8: z.string().email().optional().or(z.literal("")),
  memberEmail_9: z.string().email().optional().or(z.literal("")),
  memberEmail_10: z.string().email().optional().or(z.literal("")),
});

const Home = () => {
  const navigate = useNavigate();

  const [projectNumber, setProjectNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [isTopicOther, setIsTopicOther] = useState(false);

  const fetchProjectNumber = async () => {
    const coll = collection(db, "projects");
    const snapshot = await getCountFromServer(coll);
    setProjectNumber(snapshot.data().count);
  };

  // Counter variable
  const countupRef = useRef(null);
  let countUpAnim;

  useEffect(() => {
    fetchProjectNumber();
    initCountUp();
  }, [projectNumber]);

  const initCountUp = () => {
    countUpAnim = new CountUp(countupRef.current, projectNumber, {
      duration: 3,
    });
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
      other: "",
      memberEmail_1: "",
      memberEmail_2: "",
      memberEmail_3: "",
      memberEmail_4: "",
      memberEmail_5: "",
      memberEmail_6: "",
      memberEmail_7: "",
      memberEmail_8: "",
      memberEmail_9: "",
      memberEmail_10: "",
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
      navigate("/submit");
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
      .filter((email) => email !== "");
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

  const onTopicChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setIsTopicOther(true);
    } else {
      setIsTopicOther(false);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center w-full h-full px-8 xl:px-40 lg:border lg:border-white">
      <motion.img
        whileHover={{ scale: 1.1, rotate: 20 }}
        src={sticker_1}
        width={200}
        className="hidden lg:absolute 2xl:left-44 lg:left-24 lg:top-[430px] lg:rotate-12 lg:z-10 lg:flex"
      />
      <motion.img
        whileHover={{ scale: 1.2, rotate: 70 }}
        src={sticker_2}
        width={180}
        className="hidden lg:absolute 2xl:left-44 lg:left-24 lg:top-[490px] lg:flex"
      />
      <motion.img
        whileHover={{ scale: 1.2, rotate: 20 }}
        src={sticker_3}
        width={200}
        className="hidden lg:absolute 2xl:left-44 lg:left-24 lg:top-[220px] lg:-rotate-12 lg:z-10 lg:flex"
      />
      <motion.img
        whileHover={{ scale: 1.2, rotate: 70 }}
        src={sticker_4}
        width={160}
        className="hidden lg:absolute 2xl:left-44 lg:left-24 lg:top-[90px] lg:flex"
      />
      <motion.img
        whileHover={{ scale: 1.1, rotate: 20 }}
        src={sticker_5}
        width={190}
        className="hidden lg:absolute 2xl:right-44 lg:right-28 lg:-rotate-12 lg:top-[90px] lg:flex"
      />
      <motion.img
        whileHover={{ scale: 1.2, rotate: 70 }}
        src={sticker_6}
        width={120}
        className="hidden lg:absolute 2xl:right-52 lg:right-36 lg:top-[170px] lg:flex"
      />
      <motion.img
        whileHover={{ scale: 1.1, rotate: 20 }}
        src={sticker_7}
        width={190}
        className="hidden lg:absolute 2xl:right-52 lg:right-28 lg:top-[430px] lg:-rotate-12 lg:z-10 lg:flex"
      />
      <motion.img
        whileHover={{ scale: 1.1, rotate: -20 }}
        src={sticker_8}
        width={150}
        className="hidden lg:absolute 2xl:right-52 lg:right-28 lg:top-[490px] rotate-12 z-10 lg:flex"
      />
      {/* <div className="absolute top-96 left-[600px] w-[900px] h-[900px] rounded-full bg-gradient-to-t from-[#7455E1] via-[#6CB097] to-[#CDFF06] blur-[100px] opacity-70"></div> */}
      <section className="lg:mt-16">
        <div className="flex justify-center items-center gap-2 mb-10 lg:mb-16">
          <img src={logo} width={40} />
          <span className="text-peto font-bold text-3xl lg:text-4xl">PETO</span>
        </div>
        <h1 className="text-white text-center font-peto font-bold text-3xl mb-2 lg:mb-4 lg:text-8xl">
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
        <div className="flex flex-col items-center mt-12 mb-10 lg:mt-16 lg:mb-24">
          <Button
            className="px-10 py-4 lg:px-12 lg:py-6 text-xl font-bold rounded-[6px] border-none hover:bg-[#a1c930]"
            onClick={() => jump("#form", { offset: -30 })}
          >
            Register
          </Button>
          <Link to={"/projects"}>
            <Button
              variant="link"
              className="bg-[#0B0A09] border-none mt-2 text-lg"
            >
              View projects
            </Button>
          </Link>
        </div>
      </section>
      <Separator className="bg-white" />
      <section className="w-full mt-10 lg:mt-32">
        <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between">
          <img src={star} width={45} />
          <h2 className="text-4xl font-peto font-bold">INFORMATION</h2>
          <img src={star} width={45} />
        </div>
        <div className="flex justify-center items-center gap-2 lg:mt-16">
          <img src={logo_white} width={40} className="hidden lg:flex" />
          <span className="font-bold font-peto text-3xl lg:text-4xl lg:font-sans">
            PETO
          </span>
        </div>
        <div className="flex flex-col items-center mt-5 lg:mt-7 lg:px-10">
          <p className="text-xl lg:text-2xl lg:text-center">
            “PETO” means to seek for and to reach towards. We aim to build a
            platform for you to easily seek opportunities inside LEINN.
            Moreover, reach towards and boost your vision with reliable
            teammates.
          </p>
          <p className="text-xl lg:text-2xl lg:text-center mt-3 mb-12">
            Our platform has three main functions: project card, vision friend,
            and calendly.
          </p>
        </div>
        <span className="font-bold font-peto text-2xl lg:hidden">
          Main function
        </span>
        <div className="grid grid-cols-[90%_90%_90%] grid-rows-[230px] gap-3 overflow-scroll mt-5 lg:mt-12 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:gap-5">
          <div className=" bg-black border border-white px-4 pt-5 rounded-[8px] lg:col-span-full lg:rounded-2xl lg:px-8 lg:pt-10">
            <div className="grid h-full lg:grid-cols-2">
              <div>
                <span className="font-peto font-bold text-xl lg:text-3xl">
                  PROJECT CARD
                </span>
                <p className="hidden mt-3 lg:flex">
                  In the Project card page the project will be categorized by
                  two standards: location and topic. By this function, you can
                  check where projects are operated and the main topic of the
                  project.When you click the project that interests you, you can
                  also get more information about the project such as target
                  audience, business model, and go to market strategy.
                </p>
                <p className="mt-1">
                  The project card is a page where we categorize student
                  projects by topic.
                </p>
              </div>
              <div className="w-full h-[100px] lg:h-[500px] self-end overflow-hidden">
                <img
                  src={card_project}
                  className="m-auto w-[200px] lg:w-[550px]"
                />
              </div>
            </div>
          </div>
          <div className="bg-black border border-white px-4 pt-5 lg:px-12 lg:pt-14 rounded-[8px] lg:rounded-2xl">
            <div>
              <span className="font-peto font-bold text-xl lg:text-3xl">
                VISION FRIEND
              </span>
              <p className="hidden mt-3 lg:flex">
                Vision Friend is a page with a list of visions. You interact
                with other students with the same vision by pressing like and
                commenting below. Additionally, you can build a project with a
                vision friend with a shared vision.
              </p>
              <p className="mt-1">
                you can build a project with a vision friend with a shared
                vision.
              </p>
            </div>
            <div className="w-full h-20 lg:h-72 overflow-hidden mt-10">
              <img src={card_visionFriend} />
            </div>
          </div>
          <div className="bg-black border border-white px-4 pt-5 lg:px-12 lg:pt-14 rounded-[8px] lg:rounded-2xl">
            <span className="font-peto font-bold text-xl lg:text-3xl">
              MEET UP!
            </span>
            <p className="hidden mt-3 lg:flex">
              Calendly may sound familiar to you. You can book a meeting with a
              project you find interesting. From this function, you can get
              useful advice and feedback for your project and even collaborate
              with the following project.
            </p>
            <p className="mt-1">
              You can book a meeting with a project you find interesting.
            </p>
            <div className="w-full h-24 lg:h-80 overflow-hidden mt-7 lg:mt-4">
              <img
                src={card_detail}
                className="m-auto w-[200px] lg:w-[550px]"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="form" className="w-full lg:mt-24">
        <div className="hidden lg:flex lg:flex-row lg:items-center lg:justify-between">
          <img src={star} width={45} />
          <h2 className="text-4xl font-peto font-bold">REGISTER</h2>
          <img src={star} width={45} />
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
                          <SelectItem value="Barcelona">
                            LEINN Barcelona
                          </SelectItem>
                          <SelectItem value="Bilbao">LEINN Bilbao</SelectItem>
                          <SelectItem value="Irun">LEINN Irun</SelectItem>
                          <SelectItem value="Madrid">LEINN Madrid</SelectItem>
                          <SelectItem value="Malaga">LEINN Malaga</SelectItem>
                          <SelectItem value="Oñati">LEINN Oñati</SelectItem>
                          <SelectItem value="Valencia">
                            LEINN Valencia
                          </SelectItem>
                          <SelectItem value="Puebla">LEINN Puebla</SelectItem>
                          <SelectItem value="Seoul">LEINN Seoul</SelectItem>
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
                      <FormDescription>
                        Put slash if it is a collaboration project e.g.
                        NEOS/KOMPLOTT
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem className="mt-5 lg:mt-0" onChange={onTopicChange}>
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
                          <SelectItem value="Technology/IT/AI">
                            Technology/IT/AI
                          </SelectItem>
                          <SelectItem value="Sales/distribution">
                            Sales/distribution
                          </SelectItem>
                          <SelectItem value="Manufacturing/Industrial">
                            Manufacturing/Industrial
                          </SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Culture/Art/Design">
                            Culture/Art/Design
                          </SelectItem>
                          <SelectItem value="Consulting/Management (Brand/Marketing)">
                            Consulting/Management (Brand/Marketing)
                          </SelectItem>
                          <SelectItem value="Gastronomy">Gastronomy</SelectItem>
                          <SelectItem value="Sport">Sport</SelectItem>
                          <SelectItem value="Real estate">
                            Real estate
                          </SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isTopicOther ? (
                  <FormField
                    control={form.control}
                    name="other"
                    render={({ field }) => (
                      <FormItem className="mt-5 lg:mt-0">
                        <FormLabel className="lg:text-lg">Other</FormLabel>
                        <FormControl>
                          <Input placeholder="Type your topic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div></div>
                )}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="mt-5 lg:mt-0">
                      <FormLabel className="lg:text-lg">Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="In process">In process</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        Team members&apos; Email
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
                        Team members&apos; Email
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
                        Team members&apos; Email
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
                        Team members&apos; Email
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
                        Team members&apos; Email
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
                        Team members&apos; Email
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
                        Team members&apos; Email
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
                        Team members&apos; Email
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
                  name="memberEmail_9"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="invisible">
                        Team members&apos; Email
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
                  name="memberEmail_10"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="invisible">
                        Team members&apos; Email
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
              <FormField
                control={form.control}
                name="personalData"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="hover:border-peto p-2"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Accept personal data protection</FormLabel>
                      <FormDescription>
                        You can read personal data protection policy{" "}
                        <a
                          href="https://namu13.notion.site/Peto-Personal-data-protection-b82fa02f9ad347a49138d5a596bfa4ea?pvs=4"
                          className="text-peto hover:text-[#a1c930]"
                          target="_blank"
                          rel="noreferrer"
                        >
                          here.
                        </a>
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
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
                  className="border-none text-xl font-bold px-10 py-4 lg:px-12 lg:py-6 rounded-[6px] hover:bg-[#a1c930]"
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

/* TODO
팀컴퍼니 랩 추가
그라디언트 배경 넣기
이메일 버튼을 통해 추가
*/
