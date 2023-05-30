import { Box, chakra } from "@chakra-ui/react";
import { useLayoutEffect, useMemo, useRef } from "react";
import jazzicon from "@metamask/jazzicon";

export const Identicon = ({ seed, size }: { seed: string; size?: number }) => {
  const iconSize = size || 24;
  const icon = useMemo(
    () => jazzicon(iconSize, parseInt(seed.slice(2, 10), 16)),
    [seed, iconSize]
  );
  const iconRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const current = iconRef.current;
    if (icon) {
      current?.appendChild(icon);

      return () => {
        try {
          current?.removeChild(icon);
        } catch (error) {
          console.error("no avatar rendered");
        }
      };
    }
    return;
  }, [icon, iconRef]);

  return (
    <Box
      boxSize={`${iconSize}px`}
      fontSize="initial"
      borderRadius="50%"
      marginRight="4px"
    >
      <chakra.span ref={iconRef} />
    </Box>
  );
};
