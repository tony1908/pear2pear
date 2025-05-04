"use client"
import { motion } from "framer-motion"

export default function FooterWarning() {
  const warningText =
    "⚠️ Esto es un MVP. Las transacciones en blockchain son irreversibles. Usa 🍐2🍐 bajo tu propio riesgo. ⚠️"

  // Repetir el texto varias veces para asegurar que cubra toda la pantalla
  const repeatedText = Array(10).fill(warningText).join(" • ")

  return (
    <div className="fixed bottom-0 left-0 w-full h-10 bg-neutral-200 dark:bg-neutral-800 flex items-center overflow-hidden z-50 border-t border-neutral-300 dark:border-neutral-700">
      <motion.div
        className="whitespace-nowrap"
        animate={{
          x: [0, -2000],
        }}
        transition={{
          x: {
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
      >
        <span className="text-neutral-700 dark:text-neutral-300 font-medium px-4">{repeatedText}</span>
      </motion.div>
    </div>
  )
} 