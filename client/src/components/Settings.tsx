"use client"

import { z } from "zod"

const phoneProviders = ["Verizon", "T-Mobile", "AT&T"] as const;
const themes = ["system", "light", "dark"] as const;

const formSchema = z.object({
    name: z.string().min(1).max(255),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    theme: z.enum(themes),
    notifyAll: z.boolean(),
    notifyEmail: z.boolean(),
    notifyPhone: z.boolean(),
    email: z.string().email().optional(),
    phone: z.string().regex(/^\d{10}$/).optional(), // Plain 10 digit phone number not including country code since we're only supporting US numbers
    phoneProvider: z.enum(phoneProviders).optional(),
})
.refine(data => (data.notifyEmail && !data.email ? false : true), {
    message: "Email is required if notifyEmail is enabled",
    path: ["email"],
})
.refine(data => (data.notifyPhone && (!data.phone || !data.phoneProvider) ? false : true), {
    message: "Phone and phoneProvider are required if notifyPhone is enabled",
    path: ["phone", "phoneProvider"],
});

