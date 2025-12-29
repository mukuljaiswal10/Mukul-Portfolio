"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/shared/SectionHeading";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import Parallax from "@/components/ui/Parallax";

export default function ContactSection({ compact = false }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setStatus({ ok: true, msg: "Message sent ✅" });
      e.currentTarget.reset();
    } catch (err) {
      setStatus({ ok: false, msg: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={compact ? "py-10" : "py-16"}>
      <Container>
        <Parallax from={12} to={-12}>
          <Reveal>
            <SectionHeading
              eyebrow="Contact"
              title="Let’s build something together"
              desc="Send a message and I’ll get back to you."
            />
          </Reveal>
        </Parallax>

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal delay={0.12}>
            <Card className="h-full">
              <p className="text-white/80">
                Prefer WhatsApp / Call? You can add your details here later.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>📧 Email: yourmail@example.com</li>
                <li>📱 WhatsApp: +91XXXXXXXXXX</li>
                <li>⏱ Response: within 24 hours</li>
              </ul>
            </Card>
          </Reveal>

          <Reveal delay={0.18}>
            <Card className="h-full">
              <form onSubmit={onSubmit} className="space-y-4">
                <Reveal delay={0.02}>
                  <Input name="name" placeholder="Your name" required />
                </Reveal>
                <Reveal delay={0.05}>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your email"
                    required
                  />
                </Reveal>
                <Reveal delay={0.08}>
                  <Textarea
                    name="message"
                    placeholder="Your message"
                    required
                  />
                </Reveal>

                <Reveal delay={0.12}>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </Reveal>

                {status ? (
                  <p
                    className={`text-sm ${
                      status.ok ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {status.msg}
                  </p>
                ) : null}
              </form>
            </Card>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
