import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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

export function GroupsProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://192.168.254.235:3000/api/groups");
        setGroups(res.data.data);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch groups");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  return (
    <GroupsContext.Provider value={{ groups, loading, error }}>
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups() {
  return useContext(GroupsContext);
}