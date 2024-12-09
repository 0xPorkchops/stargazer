"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings as SettingsIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const phoneProviders = ["Verizon", "T-Mobile", "AT&T"] as const
const themes = ["system", "light", "dark"] as const

// Mock functions
const getUserSettings = async () => {
  const response = await fetch('/api/settings', {
    method : "GET",
    credentials : "include",
  });
  if (!response.ok) throw new Error('Failed to fetch settings');
  return response.json();

  // await new Promise(resolve => setTimeout(resolve, 1000))
  // return {
  //   name: "John Doe",
  //   latitude: 40.7128,
  //   longitude: -74.0060,
  //   theme: "dark" as const,
  //   notifyEmail: true,
  //   notifyPhone: true,
  //   email: "john@example.com", 
  //   phone: "1234567890",
  //   phoneProvider: "AT&T" as const,
  // }
}

const setUserSettings = async (values: FormValues) => {
  const response = await fetch('/api/settings', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(values)
  });
  if (!response.ok) throw new Error('Failed to update settings');
  return response.json();
};

const formSchema = z.object({
  name: z.string().min(1).max(255),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  theme: z.enum(themes),
  notifyEmail: z.boolean(),
  notifyPhone: z.boolean(),
  email: z.string().email().optional(),
  phone: z.string().regex(/^\d{10}$/).optional(),
  phoneProvider: z.enum(phoneProviders).optional(),
})
.refine(data => (data.notifyEmail && !data.email ? false : true), {
  message: "Email is required if notifyEmail is enabled",
  path: ["email"],
})
.refine(
  data => {
    if (!data.notifyPhone) return true
    if (!data.phone) return true
    return data.phoneProvider !== undefined
  },
  {
    message: "You must select a phone provider",
    path: ["phoneProvider"],
  }
)
.refine(
  data => {
    if (!data.notifyPhone) return true
    if (!data.phoneProvider) return true
    return data.phone !== undefined && data.phone !== ""
  },
  {
    message: "Phone number is required with phone provider",
    path: ["phone"],
  }
)

type FormValues = z.infer<typeof formSchema>

export function Settings() {
  const { toast } = useToast()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      latitude: 0,
      longitude: 0,
      theme: "system",
      notifyEmail: false,
      notifyPhone: false,
      email: "",
      phone: "",
      phoneProvider: undefined,
    },
  })

  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const settings = await getUserSettings()
        form.reset(settings)
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }
    loadUserSettings()
  }, [form])

  async function onSubmit(values: FormValues) {
    try {
      await setUserSettings(values)
      toast({
        title: "Settings saved"
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Could not save settings!",
        description: error as string,
      })
    }
  }

  const watchNotifyEmail = form.watch("notifyEmail")
  const watchNotifyPhone = form.watch("notifyPhone")

  return (
    <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="icon">
        <SettingsIcon className="h-5 w-5" />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
      <div className="mt-4">
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                Your display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="-90 to 90" 
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="-180 to 180" 
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select your preferred theme.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notifyEmail"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Email Notifications
                </FormLabel>
                <FormDescription>
                  Receive notifications via email.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {watchNotifyEmail && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="notifyPhone"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Phone Notifications
                </FormLabel>
                <FormDescription>
                  Receive notifications via SMS.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {watchNotifyPhone && (
          <>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="1234567890" {...field} />
                  </FormControl>
                  <FormDescription>
                    10-digit phone number without spaces or dashes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Provider</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {phoneProviders.map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit">Save Settings</Button>
      </form>
    </Form>
      </div>
    </DialogContent>
  </Dialog>
  )
}