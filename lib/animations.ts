import { useCallback, useEffect } from "react";
import {
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  useAnimatedStyle,
  cancelAnimation,
  Easing,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

export const SPRINGS = {
  gentle:  { damping: 18, stiffness: 180, mass: 0.9 },
  snappy:  { damping: 22, stiffness: 280, mass: 0.7 },
  bouncy:  { damping: 10, stiffness: 200, mass: 0.8 },
  smooth:  { damping: 25, stiffness: 200, mass: 1.0 },
  tab:     { damping: 12, stiffness: 220, mass: 0.75 },
} as const;

/** Fade + slide up once on first render. Use in components that already remount. */
export function useMountFade(delay = 0, fromY = 18) {
  const opacity    = useSharedValue(0);
  const translateY = useSharedValue(fromY);

  useEffect(() => {
    const run = () => {
      opacity.value    = withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) });
      translateY.value = withSpring(0, SPRINGS.gentle);
    };
    if (delay > 0) {
      const t = setTimeout(run, delay);
      return () => clearTimeout(t);
    }
    run();
  }, [delay, fromY]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

/** Fade + slide-up that replays every time the screen gains focus. Use in tab screens. */
export function useFocusFade(delay = 0, fromY = 20) {
  const opacity    = useSharedValue(0);
  const translateY = useSharedValue(fromY);

  useFocusEffect(
    useCallback(() => {
      cancelAnimation(opacity);
      cancelAnimation(translateY);
      opacity.value    = 0;
      translateY.value = fromY;

      const run = () => {
        opacity.value    = withTiming(1, { duration: 360, easing: Easing.out(Easing.cubic) });
        translateY.value = withSpring(0, SPRINGS.gentle);
      };

      let timer: ReturnType<typeof setTimeout> | null = null;
      if (delay > 0) {
        timer = setTimeout(run, delay);
      } else {
        run();
      }

      return () => { if (timer) clearTimeout(timer); };
    }, [delay, fromY]),
  );

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

/** Scale down on press, spring back on release. */
export function useScalePress(toScale = 0.955) {
  const scale = useSharedValue(1);

  const onPressIn  = () => { scale.value = withSpring(toScale, SPRINGS.snappy); };
  const onPressOut = () => { scale.value = withSpring(1, SPRINGS.bouncy); };

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { style, onPressIn, onPressOut };
}

/** Continuously pulses scale. Used for the live badge dot. */
export function usePulseScale(minScale = 0.75, maxScale = 1.3, duration = 650) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(maxScale, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(minScale, { duration, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  return useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
}

/** Continuously pulses opacity for a breathing effect. */
export function useOpacityPulse(min = 0.35, max = 1, duration = 700) {
  const opacity = useSharedValue(max);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(min, { duration, easing: Easing.inOut(Easing.ease) }),
        withTiming(max, { duration, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, []);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}

/** Bounces scale when a tab becomes focused. Replays on every focus change. */
export function useTabFocus(focused: boolean) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      scale.value = withSequence(
        withSpring(1.28, SPRINGS.bouncy),
        withSpring(1.0, SPRINGS.gentle),
      );
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [focused]);

  return useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
}

/** Slides in from a direction on every key change. */
export function useSlideIn(key: number | string, direction: 1 | -1 = 1, distance = 40) {
  const translateX = useSharedValue(direction * distance);
  const opacity    = useSharedValue(0);

  // This effect only depends on key, but it also uses direction and distance to set initial values.
  // If direction/distance change while key stays the same, the animation won't reflect the new inputs.
  // We include direction and distance in the dependency array. 
  useEffect(() => {
    translateX.value = direction * distance;
    opacity.value    = 0;
    translateX.value = withSpring(0, SPRINGS.gentle);
    opacity.value    = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
  }, [key, direction, distance]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));
}
