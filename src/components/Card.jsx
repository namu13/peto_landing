import { useEffect, useRef, useState } from "react";

const Card = ({
  projectName,
  shortDescription,
  topic,
  other,
  lab,
  teamCompany,
  image,
}) => {
  const descriptionRef = useRef();
  const [lineClamp, setLineClamp] = useState(false);
  const [viewMore, setViewMore] = useState(false);

  const isLineClamp = () => {
    setLineClamp(
      descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight
    );
  };

  useEffect(() => {
    isLineClamp();
  }, []);
  return (
    <div className="p-6 border border-white h-fit">
      <div className="flex justify-between">
        <span>{lab}</span>
        <span>{teamCompany}</span>
      </div>
      {image ? (
        <div className="mt-4 mb-4 bg-gradient-to-b from-zinc-900  to-[#0B0A09] to-95% aspect-square">
          <img src={image} className="object-cover aspect-square" />
        </div>
      ) : (
        <div className="mt-4 mb-4 bg-gradient-to-b from-peto  to-[#0B0A09] to-95% aspect-square"></div>
      )}

      <span className="text-3xl font-bold">{projectName}</span>
      {viewMore ? (
        <p ref={descriptionRef} className="mt-1 text-zinc-400">
          {shortDescription}
        </p>
      ) : (
        <div className="h-12">
          <p ref={descriptionRef} className="mt-1 text-zinc-400 line-clamp-2">
            {shortDescription}
          </p>
        </div>
      )}

      {lineClamp ? (
        viewMore ? (
          <a
            onClick={() => setViewMore(false)}
            className="block text-zinc-200 hover:text-zinc-200 hover:underline cursor-pointer mb-3"
          >
            View less
          </a>
        ) : (
          <a
            onClick={() => setViewMore(true)}
            className="block text-zinc-200 hover:text-zinc-200 hover:underline cursor-pointer mb-3"
          >
            View more
          </a>
        )
      ) : (
        <div className="h-9"></div>
      )}

      <span className="text-peto font-bold">
        # {topic === "Other" ? other : topic}
      </span>
    </div>
  );
};

export default Card;
