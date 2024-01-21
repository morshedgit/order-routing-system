// pages/admin/add-printer.tsx
"use client";

import React, { useState } from "react";
import PrinterCapabilityForm, {
  PrinterCapabilityData,
} from "../printer-capabilities/add-printer-capability/page";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import LocationForm, {
  LocationData,
} from "../locations/add-location/location-form";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  locationId: z.string().min(2).max(50),
  capabilityId: z.string().min(2).max(50),
});

export type PrinterFormValue = z.infer<typeof formSchema>;

type PrinterFormProps = {
  locations: LocationData[];
  printerCapabilities: PrinterCapabilityData[];
  onSubmit: (props: PrinterFormValue) => void;
  initialValues?: PrinterFormValue;
};

const PrinterForm = ({
  locations,
  printerCapabilities,
  initialValues,
  ...props
}: PrinterFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues ?? {
      name: "",
      locationId: "",
      capabilityId: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    props.onSubmit(values);
  }

  const [selectedForm, setSelectedForm] = useState<
    "location" | "cap" | undefined
  >();

  return (
    <>
      <Dialog>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Printer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="printer name" {...field} />
                  </FormControl>
                  <FormDescription>The printer name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Printer Location</FormLabel>
                  <div className="flex">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select printer location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations?.map((location) => (
                          <SelectItem
                            value={location.locationId!}
                          >{`${location.address} ${location.city}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <DialogTrigger className="px-2">
                      <span onClick={() => setSelectedForm("location")}>+</span>
                    </DialogTrigger>
                  </div>
                  <FormDescription>Select printer location</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capabilityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Printer Spec</FormLabel>
                  <div className="flex">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select printer spec" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {printerCapabilities?.map((cap) => (
                          <SelectItem
                            value={cap.capabilityId!}
                          >{`${cap.printType} ${cap.volumeCapacity}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <DialogTrigger className="px-2">
                      <span onClick={() => setSelectedForm("cap")}>+</span>
                    </DialogTrigger>
                  </div>
                  <FormDescription>Select printer spec</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between">
              <Button type="submit">{initialValues ? "Save" : "Add"}</Button>
              {initialValues && (
                <Button type="submit" variant="destructive">
                  Delete Printer
                </Button>
              )}
            </div>
          </form>
        </Form>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a new one</DialogTitle>
          </DialogHeader>
          {selectedForm === "location" && <LocationForm />}
          {selectedForm === "cap" && <PrinterCapabilityForm />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PrinterForm;
