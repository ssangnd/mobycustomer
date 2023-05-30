export const fadeInVariants = {
  initial: "in",
  animate: "inactive",
  exit: "out",
  variants: {
    inactive: {
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
    out: {
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
    in: {
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
  },
};

export const moveFromBottomVariants = {
  initial: "in",
  animate: "upactive",
  exit: "out",
  variants: {
    upactive: {
      bottom: 5,
      opacity: 1,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
    out: {
      bottom: -100,
      opacity: 0,

      transition: {
        duration: 0.25,
        ease: "easeInOut",
      },
    },
    in: {
      bottom: -100,
      opacity: 0,
    },
  },
};
