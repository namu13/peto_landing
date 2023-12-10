const Card = ({
  projectName,
  shortDescription,
  topic,
  other,
  lab,
  teamCompany,
  image,
}) => {
  return (
    <div className="p-6 border border-white">
      <div className="flex justify-between">
        <span>{lab}</span>
        <span>{teamCompany}</span>
      </div>
      {image ? (
        <div className="mt-4 bg-gradient-to-b from-zinc-900  to-[#0B0A09] to-95% aspect-square">
          <img src={image} className="object-cover aspect-square" />
        </div>
      ) : (
        <div className="mt-4 bg-gradient-to-b from-peto  to-[#0B0A09] to-95% aspect-square"></div>
      )}

      <span className="text-3xl font-bold">{projectName}</span>
      <div className="h-14">
        <p className="mt-2 text-zinc-400 line-clamp-2">{shortDescription}</p>
      </div>
      <span className="text-peto font-bold">
        # {topic === "Other" ? other : topic}
      </span>
    </div>
  );
};

export default Card;
