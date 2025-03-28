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
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { UploadDropzone } from '@/utils/uploadthing'
import Image from 'next/image'
import { XIcon, Loader2 } from 'lucide-react'
import { generatePdfSummary } from '@/actions/upload/upload-action'
import { useRouter } from 'next/navigation'

// Zod-schema för validering
const pdfSchema = z.object({
  file: z.any(),
})

export default function UploadForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)

  const form = useForm<z.infer<typeof pdfSchema>>({
    resolver: zodResolver(pdfSchema),
    defaultValues: {
      file: undefined,
    },
  })

  const onSubmit = async (values: z.infer<typeof pdfSchema>) => {
    const validated = pdfSchema.safeParse(values)
    if (!validated.success) return

    setPending(true)
    const toastId = toast.loading('Håller på att ladda upp...')

    try {
      const result = await generatePdfSummary(validated.data.file)

      if (!result?.data?.pdfId) {
        toast.dismiss(toastId)
        toast.error('Något gick fel vid uppladdning.')
        return
      }

      toast.dismiss(toastId)
      toast.success('PDF uppladdad!', {
        description: 'Du skickas vidare till din PDF...',
      })

      router.push(`/dashboard/${result.data.pdfId}`)
    } catch (error) {
      toast.dismiss(toastId)
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
                <div>
                  {field.value ? (
                    <div className="relative w-fit border-2 border-dotted p-2">
                      <Image
                        src="/PDF.png"
                        alt="PDF Preview"
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-4 -right-3"
                        onClick={() => field.onChange('')}
                        disabled={pending}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <UploadDropzone
                        endpoint="pdfUploader"
                        onUploadBegin={() => {
                          toast.info('Börjar ladda upp PDF...')
                          setUploadProgress(0)
                        }}
                        onUploadProgress={(progress) => {
                          setUploadProgress(progress)
                        }}
                        onClientUploadComplete={(res) => {
                          field.onChange(res[0].serverData)
                          toast.success('PDF uppladdad!')
                          setUploadProgress(null) // Nollställ efter uppladdning
                        }}
                        onUploadError={() => {
                          toast.error('Något gick fel under uppladdning.')
                          setUploadProgress(null)
                        }}
                        className="w-full border border-dashed border-gray-300 rounded-2xl p-6 text-center hover:bg-gray-50 transition"
                      />
                      {uploadProgress !== null && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                          <div
                            className="bg-rose-500 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2"
        >
          {pending && <Loader2 className="animate-spin h-4 w-4" />}
          {pending ? 'Laddar upp...' : 'Skicka in'}
        </Button>
      </form>
    </Form>
  )
}
