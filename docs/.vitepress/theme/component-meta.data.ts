import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { withCustomConfig } from 'react-docgen-typescript'
import ts from 'typescript'
import { defineLoader } from 'vitepress'

export interface ComponentApi {
  props: { name: string; type: string; default?: string; required: boolean; description: string }[]
  events: { name: string; type: string; description: string }[]
  slots: { name: string; description: string }[]
}

declare const data: Record<string, ComponentApi>
export { data }

const root = resolve(import.meta.dirname, '../../..')
const isOwn = (fileName: string) => !fileName.includes('node_modules')

/**
 * react-docgen-typescript가 읽지 못한 컴포넌트(다형성 Button 등)는 *.types.ts의 <이름>Props 타입에서
 * 컴포넌트가 직접 정의한 속성을 TypeScript로 읽는다
 */
function propsFromTypes(names: string[], typeFiles: string[]): Record<string, ComponentApi> {
  const program = ts.createProgram(typeFiles, { strict: true, skipLibCheck: true, jsx: ts.JsxEmit.ReactJSX, noEmit: true })
  const checker = program.getTypeChecker()
  const result: Record<string, ComponentApi> = {}
  for (const file of typeFiles) {
    for (const statement of program.getSourceFile(file)?.statements ?? []) {
      if (!ts.isInterfaceDeclaration(statement) && !ts.isTypeAliasDeclaration(statement)) continue
      const name = names.find(component => statement.name.text === `${component}Props`)
      if (!name || result[name]) continue
      const type = checker.getTypeAtLocation(statement.name)
      result[name] = {
        props: checker
          .getPropertiesOfType(type)
          .filter(symbol => symbol.declarations?.some(declaration => isOwn(declaration.getSourceFile().fileName)))
          .map(symbol => ({
            name: symbol.name,
            type: checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, statement)).replace(/ \| undefined$/, ''),
            default: symbol
              .getJsDocTags(checker)
              .find(tag => tag.name === 'default')
              ?.text?.map(part => part.text)
              .join(''),
            required: !(symbol.flags & ts.SymbolFlags.Optional),
            description: ts.displayPartsToString(symbol.getDocumentationComment(checker))
          })),
        events: [],
        slots: []
      }
    }
  }
  return result
}

/** 컴포넌트 소스의 props 타입·JSDoc에서 API 표를 만든다 (react-docgen-typescript). React는 이벤트도 props(on…)이고 슬롯 대신 children을 쓴다 */
export default defineLoader({
  watch: ['../../../src/components/*/*.tsx', '../../../src/components/*/*.types.ts'],
  load(files): Record<string, ComponentApi> {
    const parser = withCustomConfig(resolve(root, 'tsconfig.json'), {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // HTML 기본 속성(@types/react)은 빼고 컴포넌트가 직접 정의한 props만
      propFilter: prop => !prop.parent || isOwn(prop.parent.fileName)
    })
    const apis: Record<string, ComponentApi> = {}
    for (const doc of parser.parse(files.filter(file => file.endsWith('.tsx')))) {
      // 같은 이름이 여러 파일에서 나오면(하위 컴포넌트 등) 먼저 나온 것을 쓴다
      if (!/^[A-Z]/.test(doc.displayName) || apis[doc.displayName]) continue
      apis[doc.displayName] = {
        props: Object.values(doc.props).map(prop => ({
          name: prop.name,
          type: prop.type.raw ?? prop.type.name,
          default: prop.defaultValue?.value === undefined ? undefined : String(prop.defaultValue.value),
          required: prop.required,
          description: prop.description
        })),
        events: [],
        slots: []
      }
    }
    // 패키지에서 내보내는 이름 중 docgen이 놓친 컴포넌트
    const exported = [...readFileSync(resolve(root, 'src/index.ts'), 'utf-8').matchAll(/(?:default as |[{,]\s*)([A-Z]\w*)/g)].map(
      match => match[1]
    )
    const missing = [...new Set(exported)].filter(name => !apis[name])
    return {
      ...propsFromTypes(
        missing,
        files.filter(file => file.endsWith('.types.ts'))
      ),
      ...apis
    }
  }
})
