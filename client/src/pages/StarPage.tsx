import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm} from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useState } from 'react';
import AddressAutoCompleteInput from '@/components/AddressSearchInput';
import LoadingContainer from '@/components/LoadingContainer';

const formSchema = z.object({
  latitude: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(-90).max(90)
  ),
  longitude: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(-180).max(180)
  ),
  date: z.string(),
  constellation: z.string(),
  style: z.string()
})

function StarMap() {
  const [date, setDate] = React.useState<Date>();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const authString = btoa(
    `fae035fe-50ae-4b4a-9ff2-57736802a25a:bd42fe2afe2024a3c401a501746f1960b30bf77972c6e31cf32827b58c4d81e61b0f90cbe2eebf16c0ffb92f54622dd14f362592b6a444bc51494c29820246734e1c608a33802d0f10a9173b907fc278e4f835ee1adcde573fac0d2cc45d9fa594ff053b86628ef3cb4adffd8f8d5c11`
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      latitude: 0,
      longitude: 0,
      date: '',
      constellation: 'ori',
      style: 'default',
    },
  });

  // Callback to handle selected location
  const handleLocationSelect = ({ lat, lon }: { lat: number; lon: number }) => {
    console.log("latitude:", lat);
    console.log("longitude:", lon);
    form.setValue('latitude', lat); // Update latitude in the form
    form.setValue('longitude', lon); // Update longitude in the form
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true); 
    try {
      const res = await fetch(
        'https://api.astronomyapi.com/api/v2/studio/star-chart',
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authString}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            style: values.style.toString(),
            observer: {
              latitude: values.latitude,
              longitude: values.longitude,
              date: values.date.toString(),
            },
            view: {
              type: 'constellation',
              parameters: {
                constellation: values.constellation.toString(),
              },
            },
          }),
        }
      );

      let output;
      if (res.ok) {
        const data = await res.json();
        output = data['data']['imageUrl'];
      } else {
        output = `Error ${res.status}`;
      }
      setMessage(output); 
    } catch (error) {
      setMessage('Error occurred while fetching data.');
      console.error(error);
    } finally {
      setIsLoading(false); 
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex flex-col items-start justify-start w-1/3 p-6">
        <h2 className="text-2xl text-center mb-6">Generate your Star Map!</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Address Autocomplete Input */}
            <FormItem>
              <FormLabel>Address</FormLabel>
              <AddressAutoCompleteInput onLocationSelect={handleLocationSelect} className="flex justify-center w-[100%] md:w-[100%] justify-self-center my-8"/>
            </FormItem>

            {/* Other Form Fields */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <div>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] justify-start text-left font-normal',
                              !date && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon />
                            {date
                              ? format(date, 'PPP')
                              : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate) => {
                              if (!newDate) return;
                              setDate(newDate);
                              field.onChange(
                                newDate.toISOString().split('T')[0]
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="constellation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Constellation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a constellation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ori">Orion</SelectItem>
                      <SelectItem value="uma">Ursa Major</SelectItem>
                      <SelectItem value="umi">Ursa Minor</SelectItem>
                      <SelectItem value="cas">Cassiopeia</SelectItem>
                      <SelectItem value="tau">Taurus</SelectItem>
                      <SelectItem value="sco">Scorpius</SelectItem>
                      <SelectItem value="leo">Leo</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="style"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Map Style</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a map style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="inverted">Inverted</SelectItem>
                      <SelectItem value="navy">Navy</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>

      <div className="flex flex-col items-center justify-center w-2/3 p-6 -mt-20">
        <div className="star-map-container w-full h-full flex items-center justify-center -mt-20">
          {isLoading ? (
            <LoadingContainer />
          ):
          (message && (
            <img
              src={message}
              alt={`Status Error: ${message}`}
              className="max-w-full max-h-full object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default StarMap;



