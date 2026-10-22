import * as zod from "zod"

export const registerSchema = zod.object({
  name : zod.string().nonempty("Name is required").min(3, "Min Length is 3") ,
  username: zod.string().optional() ,
  email : zod.email().nonempty("Email is required").regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/ , "Enter a valid email address") ,
  dateOfBirth : zod.string().nonempty("Date Of Birth is requierd").refine((value) => {
    const currentDate = new Date().getFullYear()
    const userDate = new Date(value).getFullYear()
    return currentDate - userDate > 16
  }, "You are so Yong") , 
  gender : zod.enum(["male" , "female"]),
  password : zod.string().nonempty("Password is required").regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/ , "Password must include at least 8 characters , an uppercase letter (A-Z) , a lowercase letter (a-z) , a number (0-9) , a special character (# ? ! @ $ % ^ & * -)") , 
  rePassword : zod.string().nonempty("Confirm Password is required")
}).refine((obj) => {
  return obj.password === obj.rePassword
} , {path : ["rePassword"] , error : "Confirm password not match Password"})

export type registerSchemaType = zod.infer<typeof registerSchema> 

export const loginSchema = zod.object({
  email : zod.email().nonempty("Email is required").regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/ , "Enter a valid email address") ,
  password : zod.string().nonempty("Password is required").regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/ , "Password must include at least 8 characters , an uppercase letter (A-Z) , a lowercase letter (a-z) , a number (0-9) , a special character (# ? ! @ $ % ^ & * -)") , 
})

export type loginSchemaType = zod.infer<typeof loginSchema> 

export const changePassSchema = zod.object({
  password : zod.string().nonempty("Password is required") , 
  newPassword : zod.string().nonempty("Password is required").regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/ , "Password must include at least 8 characters , an uppercase letter (A-Z) , a lowercase letter (a-z) , a number (0-9) , a special character (# ? ! @ $ % ^ & * -)") , 
})

export type changePassSchemaType = zod.infer<typeof changePassSchema> 