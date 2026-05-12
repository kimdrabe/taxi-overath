import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Maria Schmidt",
    text: "Immer pünktlich und sehr freundlich. Besonders die Krankentransporte werden bei uns sehr geschätzt.",
    rating: 5,
    role: "Patientin aus Overath"
  },
  {
    name: "Thomas Becker",
    text: "Der Flughafentransfer hat einwandfrei geklappt. Pünktliche Abholung um 4 Uhr morgens – absolut zuverlässig.",
    rating: 5,
    role: "Geschäftsreisender"
  },
  {
    name: "Familie Klein",
    text: "Unser Sohn wird täglich zur KiTa gefahren. Die Fahrer sind immer freundlich und geduldig. Wir sind sehr zufrieden!",
    rating: 5,
    role: "Familie aus Overath"
  },
  {
    name: "Sabine Weber",
    text: "Seit Jahren mein erster Anruf, wenn ich eine Fahrt brauche. Taxi Overath ist einfach verlässlich.",
    rating: 5,
    role: "Stammkundin"
  }
];

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <span className="text-taxi-yellow text-sm font-semibold tracking-widest uppercase">Kundenstimmen</span>
        <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-14">Was unsere Kunden sagen</h2>

        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-taxi-card/60 backdrop-blur-sm border border-taxi-border rounded-2xl p-10 max-w-2xl mx-auto"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <p className="text-white/80 text-lg leading-relaxed mb-6 italic">"{testimonials[current].text}"</p>
              <p className="font-semibold">{testimonials[current].name}</p>
              <p className="text-white/50 text-sm">{testimonials[current].role}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? 'bg-taxi-yellow w-8' : 'bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
