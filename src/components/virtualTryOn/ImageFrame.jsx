export default function ImageFrame({ imageSrc }) {
  return (
    <div className="flex max-w-[40%] max-h-[40%] justify-center items-center py-5">
      <img
        src={imageSrc}
        className="max-w-full max-h-full object-cover z-20"
        alt="Uploaded"
      />
    </div>
  );
}
