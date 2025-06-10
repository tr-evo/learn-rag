import fs from 'fs/promises'
import path from 'path'
export interface StepData {
  id: string
  title: string
  description: string
  whatItDoes: string
  whyItMatters: string
  challenges: string[]
}

export async function getStep(locale: string, id: string): Promise<StepData> {
  const file = path.join(process.cwd(), 'locales', locale, 'steps', `${id}.json`)
  const data = await fs.readFile(file, 'utf8')
  return JSON.parse(data) as StepData
}

export async function getStepList(locale: string): Promise<Pick<StepData, 'id' | 'title'>[]> {
  const dir = path.join(process.cwd(), 'locales', locale, 'steps')
  const files = await fs.readdir(dir)
  const steps: Pick<StepData, 'id' | 'title'>[] = []
  for (const file of files.sort()) {
    const data = await fs.readFile(path.join(dir, file), 'utf8')
    const json = JSON.parse(data) as StepData
    steps.push({ id: json.id, title: json.title })
  }
  return steps
}
