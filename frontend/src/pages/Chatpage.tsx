"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import logo from "@/assets/logo.png";
import { useAppStore } from "@/store/useAppstore";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text?: string;
  textMetadata?: string;
  imgAnswer?: string;
  imgMetadata?: string;
  encodedImg?: string;
};

const chatSchema = z.object({
  message: z.string().min(1, "Enter a message"),
});

export default function ChatPage() {
  const filenames = useAppStore((state) => state.filenames);
  const navigate = useNavigate();
  const pdfs = filenames.map((name) => ({
    id: name,
    label: name,
  }));
  console.log(pdfs);

  const [messages, setMessages] = useState<Message[]>([]);
  const [imageSearch, setImageSearch] = useState(false);
  const [searchMode, setSearchMode] = useState<"all" | "subset" | "page">(
    "all"
  );
  const [subsetSelection, setSubsetSelection] = useState<string[]>([]);
  const [pagePdf, setPagePdf] = useState<string>(pdfs[0]?.id ?? "");
  const [pageNumber, setPageNumber] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: { message: "" },
  });

  const handleSubmit = async (values: z.infer<typeof chatSchema>) => {
    const userMessage: Message = { role: "user", text: values.message };
    setMessages((prev) => [...prev, userMessage]);

    try {
      let endpoint = "";
      let payload: any = {
        query: values.message,
        image_switch: imageSearch,
      };

      // Select the endpoint and payload based on searchMode
      if (searchMode === "all") {
        endpoint =
          "https://pdf-quey.azurewebsites.net/protected/chat/all_pdfs/";
      } else if (searchMode === "subset") {
        endpoint =
          "https://pdf-quey.azurewebsites.net/protected/chat/specific_pdfs/";
        payload.pdf_names = subsetSelection; // selected subset PDFs
      } else if (searchMode === "page") {
        endpoint =
          "https://pdf-quey.azurewebsites.net/protected/chat/one_pdf_page/";
        payload.pdf_name = pagePdf;
        payload.page_number = parseInt(pageNumber, 10);
      }

      const res = await axios.post(endpoint, payload, {
        withCredentials: true,
      });

      // Backend returns: { message: "...", result: {...} }
      const result = res.data.result;

      const assistantMessage: Message = {
        role: "assistant",
        text: result.text_answer,
        textMetadata: result.text_metadata,
        imgAnswer: result.img_answer,
        imgMetadata: result.img_metadata,
        encodedImg: result.encoded_img,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        role: "assistant",
        text: "There was an error retrieving the response.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    form.reset();
  };
  const handleLogout = async () => {
    try {
      await axios.post(
        "https://pdf-quey.azurewebsites.net/protected/logout/",
        {},
        { withCredentials: true }
      );

      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:block w-64 border-r bg-white p-6 space-y-6">
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
                const checked = subsetSelection.includes(p.id);
                return (
                  <div className="flex items-center space-x-2" key={p.id}>
                    <Checkbox
                      id={p.id}
                      checked={checked}
                      onCheckedChange={(val) => {
                        const isChecked = Boolean(val);
                        setSubsetSelection((prev) =>
                          isChecked
                            ? [...prev, p.id]
                            : prev.filter((x) => x !== p.id)
                        );
                      }}
                    />
                    <label htmlFor={p.id} className="text-sm">
                      {p.label}
                    </label>
                  </div>
                );
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
              <RadioGroup
                value={pagePdf}
                onValueChange={setPagePdf}
                className="space-y-2"
              >
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
            <Button className="hover: cursor-pointer" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="relative w-64 bg-white p-6 space-y-6">
            <button
              className="absolute top-4 right-4"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            {/* your sidebar content here (same as desktop) */}
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
                    const checked = subsetSelection.includes(p.id);
                    return (
                      <div className="flex items-center space-x-2" key={p.id}>
                        <Checkbox
                          id={p.id}
                          checked={checked}
                          onCheckedChange={(val) => {
                            const isChecked = Boolean(val);
                            setSubsetSelection((prev) =>
                              isChecked
                                ? [...prev, p.id]
                                : prev.filter((x) => x !== p.id)
                            );
                          }}
                        />
                        <label htmlFor={p.id} className="text-sm">
                          {p.label}
                        </label>
                      </div>
                    );
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
                  <RadioGroup
                    value={pagePdf}
                    onValueChange={setPagePdf}
                    className="space-y-2"
                  >
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
                <Button
                  className="hover: cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="md:hidden flex items-center justify-between p-4 border-b bg-white">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="font-semibold">Chat</h1>
        </div>

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
              {/* {msg.text && <p>{msg.text}</p>} */}
              {msg.text && <ReactMarkdown>{msg.text}</ReactMarkdown>}

              {/* Text metadata */}
              {/* {msg.textMetadata && (
                <p className="text-xs text-gray-500">📄 {msg.textMetadata}</p>
                )} */}

              {/* Encoded Image */}
              {msg.encodedImg && Array.isArray(msg.encodedImg) && (
                <div className="flex flex-wrap gap-2">
                  {msg.encodedImg.map((imgSrc, idx) => (
                    <img
                      key={idx}
                      src={imgSrc}
                      alt={`AI result ${idx + 1}`}
                      className="rounded-lg max-h-48 border"
                    />
                  ))}
                </div>
              )}
              {/* Image answer */}
              {/* {msg.imgAnswer && <p>{msg.imgAnswer}</p>} */}
              {msg.imgAnswer && <ReactMarkdown>{msg.imgAnswer}</ReactMarkdown>}
              {/* Text metadata */}
              {msg.textMetadata && (
                <div className="text-xs text-gray-500 space-y-1">
                  {Object.entries(msg.textMetadata).map(([doc, pages]) => (
                    <p key={doc}>
                      📄 <span className="font-semibold">{doc}</span>:{" "}
                      {Array.isArray(pages) ? pages.join(", ") : String(pages)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Form */}
        <div className="border-t bg-white p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex items-center gap-2"
            >
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
              <Button type="submit" className="hover:cursor-pointer">
                Send
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
