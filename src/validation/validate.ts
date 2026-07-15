import z from 'zod';
export const loginSchema=z.object({
    username:z.string().min(3,"min 3 letters").max(10,"not more than 10 letters"),
    password:z.string().min(8,"min 8 letters").max(20,"not more than 20 letters")
    .regex(/[A-Z]/,"must contain 1 uppercase letter")
    .regex(/[a-z]/,"must contain 1 lowercase letter")
    .regex(/[0-9]/,"must contain a number")
    .regex(/[!@#$%^&*(){}~`,<>,.?/|]/,"must contains 1 special charter")
})
