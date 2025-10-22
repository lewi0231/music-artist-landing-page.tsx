import { motion } from "framer-motion";

export default function FlickNavItem({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer"
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        variants={{
          initial: { y: 0 },
          hover: { y: "-100%" },
        }}
        transition={{ duration: 0.3, ease: "easeIn" }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{
          initial: { y: "100%" },
          hover: { y: 0 },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
