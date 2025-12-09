import type { ImportDeclaration } from "ts-morph";
import {
  AstroDeprecatedZodModuleSpecifiers,
  AstroZodModuleSpecifier,
  getZodImport,
} from "./collect-imports.ts";

export function convertAstroDeprecatedZodImports(
  importDeclarations: ImportDeclaration[],
) {
  for (const declaration of importDeclarations) {
    const zodImport = getZodImport(declaration);

    if (!zodImport || !isDeprecatedAstroZodImport(declaration)) {
      continue;
    }

    const alias = zodImport.getAliasNode()?.getText();

    // Remove the deprecated Astro Zod import.
    zodImport.remove();

    if (
      // If there no named imports remaining…
      declaration.getNamedImports().length === 0 &&
      // And no default import…
      !declaration.getDefaultImport()
    ) {
      // Remove the entire import declaration.
      declaration.remove();
    }

    // Add a new import declaration for `astro/zod`.
    declaration.getSourceFile().addImportDeclaration({
      moduleSpecifier: AstroZodModuleSpecifier,
      namedImports: [
        { name: "z", alias: alias && alias !== "z" ? alias : undefined },
      ],
    });
  }
}

function isDeprecatedAstroZodImport(declaration: ImportDeclaration) {
  return AstroDeprecatedZodModuleSpecifiers.includes(
    declaration.getModuleSpecifierValue(),
  );
}
