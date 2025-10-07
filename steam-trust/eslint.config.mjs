import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Отключаем правило
      "@typescript-eslint/no-empty-object-type": "off", // Отключаем правило
      "react-hooks/exhaustive-deps": "off", // Отключаем правило
      "@typescript-eslint/ban-ts-comment": "off", // Отключаем правило
      "@typescript-eslint/no-explicit-any": "off", // Отключаем правило
    },
  },
];

export default eslintConfig;