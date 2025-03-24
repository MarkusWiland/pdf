'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../ui/form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { UploadDropzone } from '@/utils/uploadthing'

// 1. Zod-schema för att validera PDF
const pdfSchema = z.object({
  file: z
    .any()
    .refine(
      (file: FileList) =>
        file?.length === 1 && file[0].type === 'application/pdf',
      {
        message: 'Du måste ladda upp en giltig PDF-fil',
      },
    ),
})

export default function UploadForm() {
  const form = useForm<z.infer<typeof pdfSchema>>({
    resolver: zodResolver(pdfSchema),
    defaultValues: {
      file: undefined,
    },
  })

  const [pending, setPending] = useState(false)

  async function onSubmit(values: z.infer<typeof pdfSchema>) {
    try {
      setPending(true)

      const pdfFile = values.file[0]
      const formData = new FormData()
      formData.append('file', pdfFile)

      // Ladda upp PDF till din API-route (exempel)
      // await uploadFile()

      //  if (!res.ok) throw new Error('Upload failed')
      console.log('formData', formData)
      toast.success(`PDF-filen "${pdfFile.name}" laddades upp!`)
    } catch (error) {
      toast.error('Något gick fel. Försök igen.')
    } finally {
      setPending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PDF-fil</FormLabel>
              <FormControl className="py-6">
                <UploadDropzone
                  endpoint="pdfUploader"
                  onUploadProgress={(res) => {
                    console.log('count', res)
                  }}
                  onClientUploadComplete={(res) => {
                    field.onChange(res[0].ufsUrl)
                    toast.success('Logotypen har laddats upp!')
                  }}
                  onUploadError={(error: Error) => {
                    toast.error('Något gick fel. Försök igen.')
                  }}
                  className="w-full border border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
