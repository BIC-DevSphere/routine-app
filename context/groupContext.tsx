import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Group = { id: string; name: string };
type GroupsContextType = {
  groups: Group[];
  loading: boolean;
  error: string | null;
};

const GroupsContext = createContext<GroupsContextType>({
  groups: [],
  loading: false,
  error: null,
});

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL;

export function GroupsProvider({ children }: { children: ReactNode }) {
  const { data: groups = [], isLoading: loading, error } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await axios.get(`${SERVER_URL}/api/groups`);      
      return res.data.data;
    },
  });

  return (
    <GroupsContext.Provider value={{ groups, loading, error: error?.message || null }}>
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups() {
  return useContext(GroupsContext);
}