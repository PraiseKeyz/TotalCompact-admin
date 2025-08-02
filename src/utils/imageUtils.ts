export const getImageProps = (src: string, alt: string, className?: string) => {
  const isDevelopment = import.meta.env.DEV;

  return {
    src,
    alt,
    className,
    ...(isDevelopment ? {} : { crossOrigin: "anonymous" }),
  };
};
