"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Type,
  Palette,
  Plus,
  Trash2,
  FileText,
  LayoutTemplate,
} from "lucide-react";
// Simple fallback components (to avoid build errors)
const Button = ({ children, ...props }) => (
  <button {...props} className="rounded-2xl px-4 py-3 bg-black text-white hover:opacity-90">
    {children}
  </button>
);

const Card = ({ children }) => (
  <div className="bg-white rounded-3xl shadow-sm">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-5">{children}</div>
);

export default function ProductCatalogDesignerApp() {
  const catalogRef = useRef(null);
  const [bg, setBg] = useState("#f6efe6");
  const [brandName, setBrandName] = useState("Maple Horizon");
  const [activePage, setActivePage] = useState(0);
  const [pages, setPages] = useState([
    {
      type: "cover",
      title: "Premium Oat Pancake Mix",
      subtitle: "Healthy • Easy • Delicious",
      price: "$9.99",
      body: "A clean, wholesome breakfast mix designed for busy families and health-conscious customers.",
      image: null,
    },
    {
      type: "benefits",
      title: "Why Customers Love It",
      subtitle: "Simple ingredients. Big breakfast energy.",
      price: "",
      body: `• Made with oats
• Quick preparation
• Great for families
• Perfect for retail shelves
• Delicious with maple syrup, berries, or bananas`,
      image: null,
    },
    {
      type: "product",
      title: "Product Details",
      subtitle: "Dry mixed oat pancake mix",
      price: "$9.99",
      body: "Use this page for package size, key benefits, serving ideas, ingredients, certifications, or wholesale notes.",
      image: null,
    },
  ]);

  const currentPage = pages[activePage];

  const updatePage = (field, value) => {
    const next = [...pages];
    next[activePage] = { ...next[activePage], [field]: value };
    setPages(next);
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePage("image", reader.result);
    reader.readAsDataURL(file);
  };

  const addPage = () => {
    setPages([
      ...pages,
      {
        type: "product",
        title: "New Catalog Page",
        subtitle: "Add your subtitle here",
        price: "$0.00",
        body: "Write product details, benefits, ingredients, wholesale information, or brand story here.",
        image: null,
      },
    ]);
    setActivePage(pages.length);
  };

  const deletePage = () => {
    if (pages.length === 1) return;
    const next = pages.filter((_, index) => index !== activePage);
    setPages(next);
    setActivePage(Math.max(0, activePage - 1));
  };

  const exportPDF = async () => {
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;
    if (!catalogRef.current) return;

    const pageNodes = Array.from(catalogRef.current.querySelectorAll("[data-catalog-page]"));
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [900, 1200] });

    for (let i = 0; i < pageNodes.length; i++) {
      const canvas = await html2canvas(pageNodes[i], { scale: 2, backgroundColor: null });
      const img = canvas.toDataURL("image/png");
      if (i > 0) pdf.addPage([900, 1200], "portrait");
      pdf.addImage(img, "PNG", 0, 0, 900, 1200);
    }

    pdf.save("product-catalog.pdf");
  };

  const pageTypes = {
    cover: "Cover Page",
    benefits: "Benefits Page",
    product: "Product Detail Page",
  };

  const CatalogPage = ({ page, index, preview = false }) => (
    <div
      data-catalog-page
      className="relative h-[1200px] w-[900px] overflow-hidden bg-white shadow-2xl"
      style={{ backgroundColor: bg }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.8),transparent_45%)]" />
      <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-white/30" />
      <div className="absolute bottom-[-160px] left-[-160px] h-96 w-96 rounded-full bg-white/35" />

      <div className="relative z-10 flex h-full flex-col p-16">
        <header className="mb-10 flex items-center justify-between border-b border-neutral-900/10 pb-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-neutral-700">{brandName}</p>
            <p className="mt-1 text-sm text-neutral-500">Product Catalog</p>
          </div>
          <p className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-bold text-white">Page {index + 1}</p>
        </header>

        {page.type === "cover" && (
          <main className="grid flex-1 grid-rows-[1fr_auto] gap-10">
            <div className="flex items-center justify-center">
              <div className="relative h-[620px] w-[520px] rounded-r-[42px] rounded-l-xl bg-white shadow-2xl">
                <div className="absolute left-0 top-0 h-full w-7 rounded-l-xl bg-neutral-300/70" />
                <div className="flex h-full items-center justify-center p-14">
                  {page.image ? (
                    <img src={page.image} alt="Product" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <ImageIcon className="h-28 w-28 text-neutral-300" />
                  )}
                </div>
              </div>
            </div>
            <section className="rounded-[36px] bg-white/75 p-10 backdrop-blur">
              <h1 className="text-6xl font-black leading-tight text-neutral-900">{page.title}</h1>
              <p className="mt-4 text-2xl font-semibold text-neutral-700">{page.subtitle}</p>
              <p className="mt-6 text-lg leading-8 text-neutral-700 whitespace-pre-line">{page.body}</p>
              {page.price && <p className="mt-8 inline-block rounded-full bg-neutral-900 px-7 py-3 text-2xl font-black text-white">{page.price}</p>}
            </section>
          </main>
        )}

        {page.type === "benefits" && (
          <main className="grid flex-1 grid-cols-[1fr_0.9fr] gap-10">
            <section className="flex flex-col justify-center">
              <h1 className="text-6xl font-black leading-tight text-neutral-900">{page.title}</h1>
              <p className="mt-5 text-2xl font-semibold text-neutral-700">{page.subtitle}</p>
              <div className="mt-10 rounded-[36px] bg-white/75 p-9 text-2xl font-medium leading-[1.8] text-neutral-800 whitespace-pre-line shadow-sm">
                {page.body}
              </div>
            </section>
            <section className="flex items-center justify-center rounded-[40px] bg-white/70 p-10 shadow-xl">
              {page.image ? (
                <img src={page.image} alt="Product" className="max-h-full max-w-full object-contain" />
              ) : (
                <ImageIcon className="h-28 w-28 text-neutral-300" />
              )}
            </section>
          </main>
        )}

        {page.type === "product" && (
          <main className="grid flex-1 grid-rows-[0.9fr_1fr] gap-10">
            <section className="flex items-center justify-center rounded-[40px] bg-white/70 p-12 shadow-xl">
              {page.image ? (
                <img src={page.image} alt="Product" className="max-h-full max-w-full object-contain" />
              ) : (
                <ImageIcon className="h-28 w-28 text-neutral-300" />
              )}
            </section>
            <section className="rounded-[36px] bg-white/75 p-10 backdrop-blur">
              <h1 className="text-5xl font-black leading-tight text-neutral-900">{page.title}</h1>
              <p className="mt-4 text-2xl font-semibold text-neutral-700">{page.subtitle}</p>
              <p className="mt-8 text-xl leading-9 text-neutral-700 whitespace-pre-line">{page.body}</p>
              {page.price && <p className="mt-8 inline-block rounded-full bg-neutral-900 px-7 py-3 text-2xl font-black text-white">{page.price}</p>}
            </section>
          </main>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Product Catalog PDF Designer</h1>
            <p className="text-neutral-600">Create multiple catalog pages and export them as one PDF.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={addPage} variant="outline" className="rounded-2xl px-5 py-5 shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Add Page
            </Button>
            <Button onClick={exportPDF} className="rounded-2xl px-5 py-5 shadow-sm">
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardContent className="space-y-5 p-5">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <FileText className="h-4 w-4" /> Catalog pages
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {pages.map((page, index) => (
                    <button
                      key={index}
                      onClick={() => setActivePage(index)}
                      className={`rounded-2xl border p-3 text-sm font-bold ${activePage === index ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-white text-neutral-700"}`}
                    >
                      Page {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <Type className="h-4 w-4" /> Brand name
                </label>
                <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full rounded-2xl border border-neutral-200 p-3 text-sm" />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <LayoutTemplate className="h-4 w-4" /> Page type
                </label>
                <select
                  value={currentPage.type}
                  onChange={(e) => updatePage("type", e.target.value)}
                  className="w-full rounded-2xl border border-neutral-200 bg-white p-3 text-sm"
                >
                  {Object.entries(pageTypes).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <Upload className="h-4 w-4" /> Page product photo
                </label>
                <input type="file" accept="image/*" onChange={handleUpload} className="block w-full cursor-pointer rounded-2xl border border-neutral-200 bg-white p-3 text-sm" />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <Type className="h-4 w-4" /> Page text
                </label>
                <input value={currentPage.title} onChange={(e) => updatePage("title", e.target.value)} placeholder="Page title" className="w-full rounded-2xl border border-neutral-200 p-3 text-sm" />
                <input value={currentPage.subtitle} onChange={(e) => updatePage("subtitle", e.target.value)} placeholder="Subtitle" className="w-full rounded-2xl border border-neutral-200 p-3 text-sm" />
                <input value={currentPage.price} onChange={(e) => updatePage("price", e.target.value)} placeholder="Price or callout" className="w-full rounded-2xl border border-neutral-200 p-3 text-sm" />
                <textarea value={currentPage.body} onChange={(e) => updatePage("body", e.target.value)} placeholder="Body text" rows={7} className="w-full rounded-2xl border border-neutral-200 p-3 text-sm" />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                  <Palette className="h-4 w-4" /> Catalog background
                </label>
                <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-12 w-full rounded-2xl border border-neutral-200 bg-white p-1" />
              </div>

              <Button onClick={deletePage} variant="outline" className="w-full rounded-2xl py-5 text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Current Page
              </Button>
            </CardContent>
          </Card>

          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-600">Preview: Page {activePage + 1} of {pages.length}</p>
              <p className="text-sm text-neutral-500">PDF size: 900 × 1200 px</p>
            </div>
            <div className="flex justify-center overflow-auto rounded-3xl bg-neutral-100 p-6">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="origin-top scale-[0.55] md:scale-[0.62] lg:scale-[0.68]">
                <CatalogPage page={currentPage} index={activePage} />
              </motion.div>
            </div>
          </div>
        </div>

        <div ref={catalogRef} className="fixed left-[-99999px] top-0">
          {pages.map((page, index) => (
            <CatalogPage key={index} page={page} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

