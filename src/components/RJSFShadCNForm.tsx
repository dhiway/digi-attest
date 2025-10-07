import { withTheme, type ThemeProps } from '@rjsf/core'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

// FieldTemplate: hides label visually (sr-only), adds gap, and shows field-level errors under input
const CustomFieldTemplate = (props: any) => {
  const { id, children, label, rawErrors, required } = props

  return (
    <div className="mb-6">
      {/* visually hide labels but keep them for screen readers */}
      {label && (
        <Label htmlFor={id} className="font-semibold capitalize mb-2 block">
          {label}
          {required ? ' *' : ''}
        </Label>
      )}

      {/* input / widget */}
      <div>{children}</div>

      {/* field-level errors directly under the input */}
      {rawErrors?.length > 0 && (
        <ul className="mt-1 space-y-1">
          {rawErrors.map((err: string, i: number) => (
            <li key={i} className="text-red-600 text-sm">
              {err}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ObjectFieldTemplate: render nicer fieldset header/description; avoids duplicate fieldset labels
const CustomObjectFieldTemplate = (props: any) => {
  const { description, properties } = props
  return (
    <fieldset className="border p-4 rounded-md mb-6 bg-white/50">
      {description && <p className="text-muted-foreground mb-4 text-sm">{description}</p>}
      <div>{properties.map((p: any) => p.content)}</div>
    </fieldset>
  )
}

// Disable RJSF top error list completely
const CustomErrorListTemplate = () => null

// Widgets: use rawDescription as placeholder (so description won't show twice)
const ShadCNTheme: ThemeProps = {
  widgets: {
    TextWidget: (props: any) => (
      <Input
        id={props.id}
        value={props.value ?? ''}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.rawDescription || props.placeholder || ''}
        type={props.options?.inputType || 'text'}
        aria-invalid={props.rawErrors?.length > 0 ? 'true' : undefined}
      />
    ),

    TextareaWidget: (props: any) => (
      <Textarea
        id={props.id}
        value={props.value ?? ''}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.rawDescription || props.placeholder || ''}
        aria-invalid={props.rawErrors?.length > 0 ? 'true' : undefined}
      />
    ),

    SelectWidget: (props: any) => (
      <Select onValueChange={props.onChange} value={props.value ?? ''}>
        <SelectTrigger>
          <SelectValue placeholder={props.rawDescription || props.placeholder || 'Select option'} />
        </SelectTrigger>
        <SelectContent>
          {props.options?.enumOptions?.map((opt: any) => (
            <SelectItem key={opt.value} value={opt.value as string}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),

    CheckboxWidget: (props: any) => (
      <div className="flex items-center gap-2 mb-2">
        <Switch
          checked={!!props.value}
          onCheckedChange={(v: boolean) => props.onChange(v)}
          id={props.id}
        />
        {/* keep label for screen readers but visually hidden */}
        <Label htmlFor={props.id} className="font-semibold capitalize">
          {props.label}
        </Label>
      </div>
    ),
  },

  templates: {
    FieldTemplate: CustomFieldTemplate,
    ObjectFieldTemplate: CustomObjectFieldTemplate,
    ErrorListTemplate: CustomErrorListTemplate,
    // RJSF's ButtonTemplates is nested differently depending on version; keep a safe submit button template
    ButtonTemplates: {
      SubmitButton: (props: any) => (
        <Button type="submit" className="mt-6">
          {props.uiSchema?.['ui:submitButtonText'] || 'Submit'}
        </Button>
      ),
    },
  },
}

export const ShadCNForm = withTheme(ShadCNTheme)
