import AnimatedSeparator from "./animated-separator";

function Footer() {
  return (
    <div className="uppercase">
      <AnimatedSeparator />
      <div className="flex justify-between items-center text-foreground/70 text-xs">
        <div className="">Back To Top</div>
        <div className="flex gap-6 py-10">
          <a href={""}>Mail</a>
          <a href={""}>github</a>
          <a href={""}>instagram</a>
          <a href={""}>x</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
