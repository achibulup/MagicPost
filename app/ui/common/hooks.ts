import { useReducer } from "react";

export function useRerender() {
  const [_, force] = useReducer((x) => x + 1, 0);
  return force;
}