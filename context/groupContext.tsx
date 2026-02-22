import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { API_ENDPOINTS } from "@/lib/api/apiConfig";

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

export function GroupsProvider({ children }: { children: ReactNode }) {
  const {
    data: groups = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await axiosInstance.get(API_ENDPOINTS.groupsList);
      return res.data.data;
    },
  });

  return (
    <GroupsContext.Provider
      value={{ groups, loading, error: error?.message || null }}
    >
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups() {
  return useContext(GroupsContext);
}
