import "../App.css";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect, useRef, useState } from "react";

import { CountUp } from "countup.js";
import jump from "jump.js";

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

// shed cn ui
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
  status: z.string({ required_error: "Please select status." }),
  topic: z.string({ required_error: "Please select topic." }),
  other: z.string().optional(),
  memberEmail_1: z
    .string({ required_error: "Please fill out email." })
    .email()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    }),
  memberEmail_2: z
    .string({ required_error: "Please fill out email." })
    .email()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    }),
  memberEmail_3: z
    .string()
    .email()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
  memberEmail_4: z
    .string()
    .email()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
  memberEmail_5: z
    .string()
    .email()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
  memberEmail_6: z
    .string()
    .email()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
  memberEmail_7: z
    .string()
    .email()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
  memberEmail_8: z
    .string()
    .email()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
  memberEmail_9: z
    .string()
    .email()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
  memberEmail_10: z
    .string()
    .email()
    .endsWith("@alumni.mondragon.edu", {
      message: 'Only "@alumni.mondragon.edu" email is alloweded.',
    })
    .optional(),
});

const Home = () => {
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

          <Button variant="link" className="bg-black border-none mt-2 text-lg">
            View projects
          </Button>
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
프로젝트 진행상황 상태
스티커 넣기
그라디언트 배경 넣기
설문 완료 페이지
이메일 버튼을 통해 추가
간격 띄우기
스티커 애니매이션 넣기
projects 페이지 만들기
*/
