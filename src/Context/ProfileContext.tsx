import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode } from "react";
import { UserType } from "../Types/userProfile.type";
import axios, { AxiosError } from "axios";

type ProfileContextType = {
  user: UserType | undefined;
  data: any;
  isLoading: boolean;
  isError: boolean;
  error: AxiosError<{ message?: string }> | null;
};

export const ProfileContext = createContext<ProfileContextType | null>(null);

export default function ProfileContextProvider({
  children,
}: {
  children: ReactNode;
}) {
    
  function myProfileApi() {
    return axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["myProfileApi"],
    queryFn: myProfileApi,
  });
  
  const user: UserType | undefined = data?.data?.user ?? data?.data?.data?.user;

  return (
    <ProfileContext.Provider
      value={{
        user,
        data,
        isLoading,
        isError,
        error: error as AxiosError<{ message?: string }> | null,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}