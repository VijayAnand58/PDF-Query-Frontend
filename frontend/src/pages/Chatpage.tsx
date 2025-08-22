"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import logo from "@/assets/logo.png"

type Message = {
  role: "user" | "assistant"
  text?: string
  textMetadata?: string
  imgAnswer?: string
  imgMetadata?: string
  encodedImg?: string
}

const chatSchema = z.object({
  message: z.string().min(1, "Enter a message"),
})

export default function ChatPage() {
  const pdfs = [
    { id: "pdf1", label: "PDF 1" },
    { id: "pdf2", label: "PDF 2" },
    // TODO: replace with your real uploaded list
  ]

  const [messages, setMessages] = useState<Message[]>([])
  const [imageSearch, setImageSearch] = useState(false)
  const [searchMode, setSearchMode] = useState<"all" | "subset" | "page">("all")
  const [subsetSelection, setSubsetSelection] = useState<string[]>([])
  const [pagePdf, setPagePdf] = useState<string>(pdfs[0]?.id ?? "")
  const [pageNumber, setPageNumber] = useState<string>("")

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" },
  })

  const handleSubmit = (values: z.infer<typeof chatSchema>) => {
  const userMessage: Message = { role: "user", text: values.message }
  setMessages((prev) => [...prev, userMessage])

  // Example mocked API response
  const response: Message = {
    role: "assistant",
    text: `Pretend answer for "${values.message}" using mode: ${searchMode}`,
    textMetadata: "Page 3, Document: sample.pdf",
    imgAnswer: imageSearch ? "Here’s a related diagram" : undefined,
    imgMetadata: imageSearch ? "diagram.png" : undefined,
    encodedImg: imageSearch
      ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
      : undefined,
  }

  setMessages((prev) => [...prev, response])
  form.reset()
}

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white p-6 space-y-6">
        <div className="flex justify-center mb-6">
            <img src={logo} alt="Company Logo" className="h-12 w-auto" />
        </div>
        <h2 className="text-lg font-semibold">Search Options</h2>

        {/* All PDFs */}
        <div className="flex items-center justify-between">
          <span>All PDFs</span>
          <Switch
            checked={searchMode === "all"}
            onCheckedChange={() => setSearchMode("all")}
          />
        </div>

        {/* Subset PDFs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span>Subset</span>
            <Switch
              checked={searchMode === "subset"}
              onCheckedChange={() => setSearchMode("subset")}
            />
          </div>
          {searchMode === "subset" && (
            <div className="space-y-2 ml-2">
              {pdfs.map((p) => {
                const checked = subsetSelection.includes(p.id)
                return (
                  <div className="flex items-center space-x-2" key={p.id}>
                    <Checkbox
                      id={p.id}
                      checked={checked}
                      onCheckedChange={(val) => {
                        const isChecked = Boolean(val)
                        setSubsetSelection((prev) =>
                          isChecked ? [...prev, p.id] : prev.filter((x) => x !== p.id)
                        )
                      }}
                    />
                    <label htmlFor={p.id} className="text-sm">
                      {p.label}
                    </label>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Single Page (choose ONE pdf via radio + enter page number) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span>Single Page</span>
            <Switch
              checked={searchMode === "page"}
              onCheckedChange={() => setSearchMode("page")}
            />
          </div>

          {searchMode === "page" && (
            <div className="ml-2 space-y-3">
              <RadioGroup value={pagePdf} onValueChange={setPagePdf} className="space-y-2">
                {pdfs.map((p) => (
                  <div className="flex items-center space-x-2" key={p.id}>
                    <RadioGroupItem value={p.id} id={`radio-${p.id}`} />
                    <label htmlFor={`radio-${p.id}`} className="text-sm">
                      {p.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
              <Input
                type="number"
                placeholder="Page number"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                min={1}
              />
            </div>
          )}
        </div>
        {/* Image Search */}
        <div className="flex items-center justify-between">
          <span>Image Search</span>
          <Switch
            checked={imageSearch}
            onCheckedChange={(val) => setImageSearch(Boolean(val))}
          />
      </div>
      <div className="absolute bottom-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
            <Button className="hover: cursor-pointer">Logout</Button>
        </div>
      </div>
</div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, i) => (
            <div
                key={i}
                className={`max-w-xl px-4 py-2 rounded-lg space-y-2 ${
                msg.role === "user"
                    ? "bg-primary text-white ml-auto"
                    : "bg-white border shadow-sm mr-auto"
                }`}
            >
                {/* Text answer */}
                {msg.text && <p>{msg.text}</p>}

                {/* Text metadata */}
                {msg.textMetadata && (
                <p className="text-xs text-gray-500">📄 {msg.textMetadata}</p>
                )}

                {/* Image answer */}
                {msg.imgAnswer && <p>{msg.imgAnswer}</p>}

                {/* Encoded Image */}
                {msg.encodedImg && (
                <img
                    src={msg.encodedImg}
                    alt="AI result"
                    className="rounded-lg max-h-48 border"
                />
                )}

            </div>
            ))}

        </div>

        {/* Input Form */}
        <div className="border-t bg-white p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Ask something..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="hover:cursor-pointer">Send</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
