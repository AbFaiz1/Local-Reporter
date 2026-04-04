export default function IssueMedia({ src, alt }) {
  if (!src) {
    return (
      <div className="flex h-52 items-center justify-center rounded-[1.2rem] bg-sand text-sm font-semibold text-ink/45">
        No media uploaded
      </div>
    );
  }

  const isVideo = /\.(mp4|webm|ogg)$/i.test(src);

  if (isVideo) {
    return (
      <video controls className="h-52 w-full rounded-[1.2rem] bg-ink object-cover">
        <source src={src} />
      </video>
    );
  }

  return <img src={src} alt={alt} className="h-52 w-full rounded-[1.2rem] object-cover" />;
}
