import Card from "@/components/Card";
import { useEffect, useRef, useState } from "react";

import {
  collection,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";

import { CountUp } from "countup.js";
import { motion } from "framer-motion";

import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import logo from "../assets/peto.svg";
import sticker_4 from "../assets/sticker_4.svg";
import sticker_5 from "../assets/sticker_5.svg";

const Projects = () => {
  const [projectNumber, setProjectNumber] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectNumber = async () => {
    const coll = collection(db, "projects");
    const snapshot = await getCountFromServer(coll);
    setProjectNumber(snapshot.data().count);
  };

  const fetchProjects = async () => {
    const projectQuery = query(
      collection(db, "projects"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(projectQuery);
    const projects = snapshot.docs.map((doc) => {
      const {
        projectName,
        shortDescription,
        topic,
        other,
        lab,
        teamCompany,
        image,
      } = doc.data();
      return {
        id: doc.id,
        projectName,
        shortDescription,
        topic,
        other,
        lab,
        teamCompany,
        image,
      };
    });
    setProjects(projects);
    setLoading(false);
  };

  // Counter variable
  const countupRef = useRef(null);
  let countUpAnim;

  useEffect(() => {
    fetchProjectNumber();
    fetchProjects();
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
  return (
    <div className="flex flex-col justify-start items-center w-full h-full px-8 xl:px-40 lg:border lg:border-white">
      <motion.img
        whileHover={{ scale: 1.2, rotate: 70 }}
        src={sticker_4}
        width={160}
        className="hidden lg:absolute lg:left-48 lg:top-[280px] lg:flex"
      />
      <motion.img
        whileHover={{ scale: 1.1, rotate: 20 }}
        src={sticker_5}
        width={190}
        className="hidden lg:absolute lg:right-48 lg:-rotate-12 lg:top-[90px] lg:flex"
      />
      <section className="lg:mt-16">
        <Link to={"/"}>
          <div className="flex justify-center items-center gap-2 mb-10 lg:mb-16">
            <img src={logo} width={40} />
            <span className="text-peto font-bold text-3xl lg:text-4xl">
              PETO
            </span>
          </div>
        </Link>
        <h1 className="text-white text-center font-peto font-bold text-3xl mb-8 lg:mb-12 lg:text-8xl">
          PROJECTS
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
        <div className="w-full flex justify-center mt-2">
          <Link to={"/"}>
            <Button
              variant="link"
              className="bg-[#0B0A09] border-none mt-2 text-lg"
            >
              Back to home
            </Button>
          </Link>
        </div>
      </section>
      <Separator className="hidden lg:bg-white lg:mt-20 lg:flex" />
      <section className="mt-20">
        <div className="grid grid-cols-1 gap-5 mb-20 lg:grid lg:grid-cols-3 lg:px-10">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((key) => (
                <Skeleton key={key} className="w-96 h-[550px]" />
              ))
            : projects.map((project) => <Card key={project.id} {...project} />)}
        </div>
      </section>
    </div>
  );
};

export default Projects;
